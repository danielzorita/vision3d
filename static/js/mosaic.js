document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('mosaic-grid');
    if (!grid) return;

    const tileImages = [
        '/static/images/mosaic/tile1.png',
        '/static/images/mosaic/tile2.png',
        '/static/images/mosaic/tile3.png',
        '/static/images/mosaic/tile4.png',
        '/static/images/mosaic/tile5.png',
        '/static/images/mosaic/tile6.png',
        '/static/images/mosaic/tile7.png',
        '/static/images/mosaic/tile8.png',
        '/static/images/mosaic/tile9.png',
        '/static/images/mosaic/tile10.png',
        '/static/images/mosaic/tile11.png',
        '/static/images/mosaic/tile12.png',
        '/static/images/mosaic/tile13.png',
        '/static/images/mosaic/tile14.png',
        '/static/images/mosaic/tile15.png',
        '/static/images/mosaic/tile16.png',
        '/static/images/mosaic/tile17.png'
    ];

    /**
     * Fills the grid with tiles.
     */
    function populateGrid() {
        grid.innerHTML = '';
        const totalTiles = 25; // Dense grid

        for (let i = 0; i < totalTiles; i++) {
            const tile = document.createElement('div');
            tile.className = 'mosaic-tile';
            
            // Randomly assign wide or tall classes
            if (Math.random() > 0.8) tile.classList.add('wide');
            if (Math.random() > 0.8) tile.classList.add('tall');
            
            const img = document.createElement('img');
            img.src = tileImages[i % tileImages.length];
            
            tile.appendChild(img);
            grid.appendChild(tile);

            // Subtle rotation animation
            img.style.transform = `scale(1.2) rotate(${Math.random() * 5 - 2.5}deg)`;
        }
    }

    /**
     * Mouse reactive parallax (Very subtle & axis-aligned)
     * Removed the fixed rotate(-2deg) to prevent pixelation/aliasing
     */
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        grid.style.transform = `translate(${x}px, ${y}px)`;
    });

    populateGrid();
});
