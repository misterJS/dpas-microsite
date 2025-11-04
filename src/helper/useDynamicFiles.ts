export function getImageUrl(name?: string) {
    return new URL(`/src/assets/product-image/${name}`, import.meta.url).href
}