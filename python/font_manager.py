import os
import sys
import ctypes
import urllib.request
import re
from fontTools.ttLib import TTFont

class FontManagerError(Exception):
    """Raised when a requested font cannot be loaded, converted, or registered."""
    pass

class FontManager:
    def __init__(self, cache_dir="public/fonts"):
        self.cache_dir = os.path.abspath(cache_dir)
        os.makedirs(self.cache_dir, exist_ok=True)
        self.registered_fonts = set()

    def _clean_family_folder(self, family_name):
        return re.sub(r'[^a-zA-Z0-9_-]', '_', family_name.strip())

    def get_font_ttf_path(self, family_name):
        clean_folder = self._clean_family_folder(family_name)
        family_dir = os.path.join(self.cache_dir, clean_folder)
        return os.path.join(family_dir, "regular.ttf")

    def fetch_and_cache_font(self, family_name):
        if not family_name or not isinstance(family_name, str):
            return None

        family_name = family_name.strip()
        if not family_name:
            return None

        ttf_path = self.get_font_ttf_path(family_name)
        if os.path.exists(ttf_path):
            return ttf_path

        clean_folder = self._clean_family_folder(family_name)
        family_dir = os.path.join(self.cache_dir, clean_folder)
        os.makedirs(family_dir, exist_ok=True)

        print(f"[FontManager] Fetching Google Font asset for '{family_name}'...")
        clean_api_family = family_name.replace(" ", "+")
        css_url = f"https://fonts.googleapis.com/css2?family={clean_api_family}"
        
        # Request with IE11 User-Agent to receive WOFF format suitable for TTFont conversion
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko'}
        req = urllib.request.Request(css_url, headers=headers)
        
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                css_content = resp.read().decode('utf-8', errors='ignore')

            urls = re.findall(r'url\((https://[^)]+)\)', css_content)
            if not urls:
                raise FontManagerError(f"No valid font resource URLs found in Google Fonts CSS for '{family_name}'")

            font_binary_url = urls[0]
            woff_temp_path = os.path.join(family_dir, "temp_font.woff")

            print(f"[FontManager] Downloading font binary from {font_binary_url}")
            font_req = urllib.request.Request(font_binary_url, headers=headers)
            with urllib.request.urlopen(font_req, timeout=15) as font_resp, open(woff_temp_path, 'wb') as out_f:
                out_f.write(font_resp.read())

            # Process and convert WOFF -> TTF using fontTools
            print(f"[FontManager] Decompressing/converting font with fontTools...")
            font = TTFont(woff_temp_path)
            
            # Validate required OpenType/TrueType tables
            required_tables = ['head', 'name', 'cmap']
            for tbl in required_tables:
                if tbl not in font:
                    raise FontManagerError(f"Font file for '{family_name}' is missing required OpenType table '{tbl}'")

            font.flavor = None  # Convert WOFF container to raw TrueType format
            font.save(ttf_path)

            if os.path.exists(woff_temp_path):
                try:
                    os.remove(woff_temp_path)
                except Exception:
                    pass

            print(f"[FontManager] Successfully cached validated TTF: {ttf_path}")
            return ttf_path

        except Exception as e:
            if isinstance(e, FontManagerError):
                raise e
            raise FontManagerError(f"Unable to load selected font: '{family_name}'. Error: {e}")

    def register_font_with_windows(self, family_name):
        if not family_name or not isinstance(family_name, str) or not family_name.strip():
            return True

        family_name = family_name.strip()
        if family_name in self.registered_fonts:
            return True

        ttf_path = self.fetch_and_cache_font(family_name)
        if not ttf_path or not os.path.exists(ttf_path):
            raise FontManagerError(f"Unable to locate cached font file for '{family_name}'")

        if sys.platform == 'win32':
            abs_ttf = os.path.abspath(ttf_path)
            res = ctypes.windll.gdi32.AddFontResourceW(abs_ttf)
            if res == 0:
                raise FontManagerError(f"Unable to register selected font '{family_name}' with Windows GDI (AddFontResourceW returned 0).")

            # Broadcast WM_FONTCHANGE (0x001D) to notify PowerPoint COM
            HWND_BROADCAST = 0xFFFF
            WM_FONTCHANGE = 0x001D
            SMTO_ABORTIFHUNG = 0x0002
            result = ctypes.c_ulong()
            ctypes.windll.user32.SendMessageTimeoutW(
                HWND_BROADCAST, WM_FONTCHANGE, 0, 0, SMTO_ABORTIFHUNG, 2000, ctypes.byref(result)
            )
            print(f"[FontManager] Registered '{family_name}' with Windows GDI (result={res}).")

        self.registered_fonts.add(family_name)
        return True
