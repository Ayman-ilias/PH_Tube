// let currentCategoryId = 'catagoryID'; 
let currentCategoryId = '1000'; 
    let sortByViews = false; 

    async function fetchData(x) {
        const response = await fetch(x);
        const data = await response.json();
        return data;
    }
    function getVideosByCategory(videos, categoryId) {
        // return videos.filter(video => categoryId === "catagoryID");
        return videos.filter(video => categoryId === "1000" || video.category_id === categoryId);
    }

    function sortVideosByViews(videos) {
        return videos.slice().sort((a, b) => {
            const viewsA = parseInt(a.others.views.replace('K', '000'));
            const viewsB = parseInt(b.others.views.replace('K', '000'));
            return viewsB - viewsA;
        });
    }
    function convertTime(seconds) {
        // if (!seconds) return null; 
        // if (!seconds) return '${hours}'; 
        if (!seconds) return ''; 
        const hours = Math.floor(seconds / 3600);
        // const minutes = Math.floor(hours/ 60);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours} hours ${minutes} minutes ago`;
    }

    function displayVideos(videos) {
        const videoContainer = document.getElementById('videoContainer');
        videoContainer.innerHTML = '';

        if (videos.length === 0) {
            const ooopps = document.createElement('div');
            ooopps.className = 'noVideoMessage';
            ooopps.innerHTML = 
            `
                <img src="./Icon.png" alt="No videos available" style="max-width: 100%;">
                <h1 style="margin-top:10px;font-weight:bold;">Ooopps...No Videos Available Here</h1>
            `
            ;
            videoContainer.appendChild(ooopps);
        } else {
            // const videosToDisplay = sortByViews(videos) ? sortVideosByViews(videos) : videos;
            const videosToDisplay = sortByViews ? sortVideosByViews(videos) : videos;

            videosToDisplay.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.className = 'videoCard';
                videoElement.innerHTML = 
                `
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <h3 style="font-weight:bold;">${video.title}</h3>
                    <p>Views: ${video.others.views}</p>
                     ${video.others.posted_date ? `<p>${convertTime(video.others.posted_date)}</p>` : ''}

                    <div class="authorInfo">
                        <img src="${video.authors[0].profile_picture}" alt="Profile Picture">
                        <p style="font-weight:500;">${video.authors[0].profile_name}</p>
                        ${video.authors[0].verified ? '<i class="fa-solid fa-circle-check iicon"></i>' : ''}
                    </div>
                `
                ;
                videoContainer.appendChild(videoElement);
            });
        }
    }

    async function onCategoryChange(categoryId) {
        currentCategoryId = categoryId;
        try {
            const videoData = await fetchData('./file.json');
            const videos = videoData.data;
            const categoryVideos = getVideosByCategory(videos, currentCategoryId);
            displayVideos(categoryVideos);
        } 
        catch (error) {
            console.error('Error', error);
        }
    }

    function onSortByViewed() {
        sortByViews = !sortByViews;
        onCategoryChange(currentCategoryId);
    }

    onCategoryChange(currentCategoryId);