import '../styles/index.scss';

const API_KEY='AIzaSyDqUIvxpfdQAQYKqwowHWQ31S2wwMarRCE';
const CLIPS_NUMBER = 5;

let DATA = {};

let indexCurrentPage = 0;
let pages = document.createElement('span');

const wrapper = document.createElement("div");
wrapper.className='wrapper';

wrapper.innerHTML = '\
<div class="container">\
  <input type="text" class="input" placeholder="Enter a query">\
  <input type="button" value="search" class="search-btn">\
</div>\
';

document.body.appendChild(wrapper);

const clips = document.createElement('div');
clips.className = 'clips';
document.body.appendChild(clips);
document.body.appendChild(pages);

const input = document.querySelector('.input');

const searchButton = document.querySelector('.search-btn');

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${input.value}&part=snippet&type=video&maxResults=${CLIPS_NUMBER*5}`; 
    fetch(url)
      .then(function(response){
    return response.json();
    }).then(data =>{
      DATA = data;
      clips.innerHTML='';

      data.items.forEach((item, index) =>{
        if(index>indexCurrentPage*5 && index<indexCurrentPage*5+5) {
          clips.appendChild(renderClip(item));
        }
        
      });
      document.body.appendChild(renderPaging(data));
    });

      
    
  }
});

const renderClip = (item) => {
        const clip = document.createElement('div');
        clip.className = 'clip';
        clip.innerHTML = `
        <span>${item.snippet.title}</span>
        <a href='https://www.youtube.com/watch?v=${item.id.videoId}' target='_blank'><img src=${item.snippet.thumbnails.medium.url}></a>
        <div class="video-info"> 
          <div class="channel-name"><i class="fas fa-male"></i><span>${item.snippet.channelTitle}</span></div>
          <div class="date"><i class="far fa-calendar-alt"></i><span>${item.snippet.publishedAt.slice(0,10)}</span></div>
          <p>${item.snippet.description}</p>
        </div>`;

        return clip;
};

const renderPaging = (data) =>{
  pages.innerHTML = '';
  if(data.pageInfo.totalResults> CLIPS_NUMBER){
    let startIndex = indexCurrentPage < 2 ? 0 : indexCurrentPage - 2;
    let endIndex = indexCurrentPage < 2 ? 5 : indexCurrentPage + 3;
    for(let i = startIndex; i < endIndex; i++){
      pages.appendChild(renderDot(i));
    }
  } else {
    pages.innerHTML = '';
  } 
  return pages;
};

const renderDot = (count) =>{
  let dot = document.createElement('span');
  dot.className = 'dot';
  dot.innerHTML = count;
  if(count === indexCurrentPage){
    dot.classList.add('selected');
  }
  dot.onclick = ()=> onClickHandler(count); 
  return dot; 
};

const onClickHandler = (count) =>{
  if(count !== indexCurrentPage){
    indexCurrentPage = count;
    renderPaging(DATA);
  }
  indexCurrentPage = count;
  if(DATA.items.length - indexCurrentPage*5 < 10){
    loadData();
  }
};

const loadData = () =>{
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${input.value}&part=snippet&type=video&maxResults=${CLIPS_NUMBER*5}&pageToken=${DATA.nextPageToken}`;
  fetch(url)
  .then(function(response){
    return response.json();
    }).then( data =>{
      console.log(data);
    }

    );
};







