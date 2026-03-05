export function getPostMediaUrl(filename, cacheBuster) {
    const safeName = encodeURIComponent(filename);
    return (
        `http://localhost:8080/posts/uploads/${safeName}` +
        (cacheBuster ? `?v=${cacheBuster}` : "")
    );
}
