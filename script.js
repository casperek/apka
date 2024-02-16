const socket = new WebSocket('ws://192.168.3.25:3000');

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'init' || data.type === 'update') {
        songs = data.data;
        displaySongs();
    }
});

function addSong() {
    const titleInput = document.getElementById('songTitle');
    const title = titleInput.value.trim();

    if (title !== '') {
        console.log('Adding song:', title);
        socket.send(JSON.stringify({ type: 'addSong', title }));
        titleInput.value = '';
    }
}

function vote(index) {
    const canVote = !votedSongs.includes(index);

    if (canVote) {
        socket.send(JSON.stringify({ type: 'vote', index }));
    } else {
        alert('Możesz zagłosować tylko raz na daną piosenkę!');
    }
}

function displaySongs() {
    const songsList = document.getElementById('songsList');
    songsList.innerHTML = '';

    songs.sort((a, b) => b.votes - a.votes);

    songs.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'songs';
        songElement.innerHTML = `
            <span>${song.title}</span>
            <span>Votes: ${song.votes}</span>
            <button class="voteButton" onclick="vote(${index})">Vote</button>
        `;
        songsList.appendChild(songElement);
    });
}