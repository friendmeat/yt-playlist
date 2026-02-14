# yt-playlist-element
custom element for displaying a list of YouTube videos

# Usage

## JSON Playlist Data

**id**: YouTube video ID 
**title**: Display title for song
**artist**: Display artist for song

```json
[
    {"title":"Brick Dust", "artist":"Prison Religion", "id":"Ug3FQK3kxAE"},
    {"title":"Constant", "artist":"Xanopticon", "id":"pZrKnHQtqsg"},
    {"title":"River Like Spine", "artist":"Jefre Cantu-Ledesma", "id":"5P2lOjP_ozw"},
    {"title":"Little Panda McElroy", "artist":"Xiu Xiu", "id":"X8wOehNgaMM"},
    {"title":"Flim", "artist":"Aphex Twin", "id":"-yNHlKAzyVA"}
]
```

## HTML
```html
<head>
    <script src="/node_modules/@friendmeat/yt-playlist-element/dist/main.js" type="module"></script>
</head>
<!-- Use a file -->
<yt-playlist data-yt-playlist="/playlist.json" /> 

<!-- Or include data inline -->
<yt-playlist data-yt-playlist='[{"title":"Brick Dust", "artist":"Prison Religion", "id":"Ug3FQK3kxAE"}]' />
```

# Style
The `yt-playlist` custom element contains a [shadow root](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot), so global styles will not effect it. Use the following [`part`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::part) pseudo-elements to style the playlist. 

```css
yt-playlist::part(yt-playlist-video-list){
    /* The list of videos */
}

yt-playlist::part(yt-playlist-item-active){
    /* The active video in the playlist */
}

yt-playlist::part(yt-playlist-item-label){
    /* The label for each playlist item */
}
```
