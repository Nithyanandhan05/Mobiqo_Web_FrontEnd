/**
 * Image Quality Enhancer
 * Upgrades low-quality Google thumbnail URLs to high-quality images.
 * Bypasses hotlink protection and broken URLs without changing backend code.
 */

export function getHDImage(currentUrl: string | undefined | null, deviceName: string): string {
    // If there's no URL, it's a generic placeholder, or if it's a blocked amazon/wallpapershome link, inject our smart fallback
    if (!currentUrl || currentUrl.includes('via.placeholder.com') || currentUrl.includes('amazon.com') || currentUrl.includes('wallpapershome.com')) {
        const cleanName = deviceName.split('(')[0].trim();
        const query = encodeURIComponent(`${cleanName} smartphone official press HD textless background`);
        return `https://tse1.mm.bing.net/th?q=${query}&w=900&h=900&c=1&rs=2&pid=ImgRaw`;
    }

    // Otherwise, we strictly trust the exact image address the Admin pasted into the system!
    return currentUrl;
}
