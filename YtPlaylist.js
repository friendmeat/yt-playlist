class YTVideo {
    constructor(ytVideoID) {
        this.id = ytVideoID;
    }

    /**
     * @param {number} [number=0] The id of the YouTube thumbnail (0-3)
     */
    thumbnail(number = 0) {
        return `https://img.youtube.com/vi/${this.id}/${number}.jpg`
    }

    /**
     * @param {number} [width=560] Iframe width
     * @param {number} [height=315] Iframe height
     * @returns HTMLIframeElement
     */
    embed(width = 560, height = 315) {
        const iframe = document.createElement("iframe");
        // iframe.setAttribute("width", width);
        // iframe.setAttribute("height", height);
        iframe.setAttribute("src", `https://www.youtube.com/embed/${this.id}`);
        iframe.setAttribute("frameborder", 0)
        iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin")
        return iframe
    }
}

class YTMusicVideo extends YTVideo {
    /**
     * @param ytVideoID {string} YouTube ID of the video
     * @param title {string} Title of the song
     * @param artist {string} Artist of the song
     */
    constructor(ytVideoID, title, artist) {
        super(ytVideoID)
        this.title = title
        this.artist = artist
    }
}


export default class YTPlaylist extends HTMLDivElement {
    constructor() {
        super();
        this.videos = [];
        this.primary = undefined;
    }

    static observedAttributes = ["data-yt-videos", "data-yt-primary"]

    async connectedCallback() {
        // Create Shadow root
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = `<style>
        .yr-playlist-wrapper {
            display: flex;
            flex-direction: column;
            height:100%;
        }

        .yt-playlist-video-list {
            list-style: none;
            margin: 0;
            padding: 0;
            overflow-y: scroll;
        }

        .yt-playlist-video-primary { 
            aspect-ratio: calc(16 / 9);
        }

        .yt-playlist-video-primary > iframe {
            width: 100%;
            height: 100%;
        }

        .yt-playlist-video-list li {
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        .yt-playlist-thumbnail-container {
            overflow: hidden;
            flex-shrink: 0;
        }

        .yt-playlist-video-label {
            padding-left: 1rem;
        }
        </style>`;

        // Get playlist from JSON on the server
        const playlistFile = this.getAttribute("data-yt-videos")
        this.videos = await this._getVideos(playlistFile)

        // Wrapper element
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "yt-playlist-wrapper");

        // Set primary video that will be embedded
        this.primary = this.videos[0]
        this.setAttribute("data-yt-primary", this.primary.id);

        const videoPrimary = document.createElement("div");
        videoPrimary.appendChild(this.primary.embed());
        videoPrimary.className = "yt-playlist-video-primary";
        videoPrimary.setAttribute("part", "yt-playlist-video-primary")

        // Create playlist list
        const videoUl = document.createElement("ul");
        videoUl.setAttribute("class", "yt-playlist-video-list");
        videoUl.setAttribute("part", "yt-playlist-video-list");

        for (let i = 0; i < this.videos.length; i++) {
            const video = this.videos[i];
            const videoLi = document.createElement("li");
            videoLi.setAttribute("data-yt-video-id", video.id);
            videoLi.setAttribute("part", "yt-playlist-item");
            if (video.id === this.primary.id) {
                videoLi.setAttribute("class", "yt-playlist-active");
                videoLi.setAttribute("part", "yt-playlist-item-active")
            }

            videoLi.addEventListener("click", e => {
                e.preventDefault();
                if (video.id != this.primary.id) {
                    videoPrimary.replaceChild(video.embed(), videoPrimary.firstChild);
                    this.setAttribute("data-yt-primary", video.id);
                    this.primary = video;
                }
            });

            const thumbnailContainer = document.createElement("div")
            thumbnailContainer.setAttribute("class", "yt-playlist-thumbnail-container");
            const thumbnail = document.createElement("img");
            thumbnail.setAttribute("src", video.thumbnail(1));
            thumbnailContainer.appendChild(thumbnail);
            const label = document.createElement("div");
            label.setAttribute("class", "yt-playlist-video-label");
            label.setAttribute("part", "yt-playlist-item-label");
            label.innerHTML = `<span class="yt-playlist-video-label-artist" part="yt-playlist-video-label-artist">${video.artist}</span> - <span part="yt-playlist-video-label-title" class="yt-playlist-video-label-title">"${video.title}"</span>`;
            videoLi.appendChild(thumbnailContainer);
            videoLi.appendChild(label);
            videoUl.appendChild(videoLi);
        }

        wrapper.append(videoPrimary);
        wrapper.append(videoUl);
        shadowRoot.append(wrapper);
    }

    /**
     * @param {string} name 
     * @param {string} oldValue 
     * @param {string} newValue
    */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue && name == "data-yt-primary") {
            console.log(`Primary video was changed: old=${oldValue}, new=${newValue}`);
            const oldItem = this.shadowRoot.querySelector(`li[data-yt-video-id="${oldValue}"]`);
            const newItem = this.shadowRoot.querySelector(`li[data-yt-video-id="${newValue}"]`);
            oldItem.setAttribute("class", "");
            oldItem.setAttribute("part", oldItem.getAttribute("part").split(" ").filter(part => part != "yt-playlist-item-active").join(" "))
            newItem.setAttribute("class", "yt-playlist-active");
            newItem.setAttribute("part", newItem.getAttribute("part").split(" ").filter(part => part != "yt-playlist-item-active").join(" ") + " yt-playlist-item-active")
        }
    }

    /**
    * @param file {string} Location of playlist json file
    */
    async _getVideos(file) {
        return fetch(file, {})
            .then(res => res.json())
            .then(data => data.map(({ id, title, artist }) => new YTMusicVideo(id, title, artist))
            )
    }
}
