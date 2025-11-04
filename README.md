# yt-playlist-element
custom element for displaying a list of YouTube videos

# Usage
```html
<head>
    <script src="/node_modules/@friendmeat/yt-playlist-element/dist/main.js" type="module"></script>
</head>
<!-- ... -->
<yt-playlist data-yt-playlist-file="/playlist.json" /> 
```

# Style
The `yt-playlist` custom element contains a [shadow root](), so global styles will not effect it. Use the following [`part`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::part) pseudo-elements to style the playlist. 

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
