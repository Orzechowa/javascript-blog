'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-cloud-tag-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-cloud-author-link').innerHTML),
}

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');
    
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.post.active');
    
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');

};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorsSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors.list';

// Generate title links

function generateTitleLinks(customSelector = ''){
  console.log (generateTitleLinks);

  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
      
  /* find all the articles and save them to variable:  articlesv */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(articles);
  
  let html = '';
    
  for(let article of articles){
  
    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log(articleId);
  
    /* find the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* get the title from the title element */
  
    /* create HTML of the link */
      
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into html variable */

    html = html + linkHTML;
  }
  titleList.innerHTML =html;
  
  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();


function calculateTagsParams(tags){
  const params = {max: 0, min: 999999};
  for(let tag in tags){
    console.log(tag + 'is used' + tags[tag] + 'times');
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
}

// Generate Tags


function generateTags(){
  /* [NEW] create a new variable allTags with an emoty array */

  let allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);

  /* START LOOP: for every article: */

  for(let article of articles){

    /* find tags wrapper */

    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    console.log(tagsWrapper);

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */

    for(let tag of articleTagsArray){

      /* generate HTML of the link */

      const linkHTMLData = {id: tag, title: tag};
      const tagLinkHTML = templates.tagLink(linkHTMLData);
      console.log(tagLinkHTML)

      /*const tagLinkHTML = '<li><a href="#tag-' + tag + '"><span> ' + tag + '</span></a></li>';
      console.log(tagLinkHTML);*/

      /* add generated code to html variable */

      html = html + tagLinkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */

    tagsWrapper.innerHTML = html;

  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  
  for(let tag in allTags){
    
    const tagLinkHTML = '<li><a class=" ' + calculateTagClass(allTags[tag],tagsParams) + '" href = "#tag- ' + tag + '"> ' + tag + ' </a></li>' ;
    
    console.log('tagLinkHTML:', tagLinkHTML);
    
    /* [NEW] generate code of a link and add it to allTagsHTML */
    
    //allTagsHTML += tagLinkHTML;

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  
    /* [NEW] END LOOP: for each tag in allTags: */
  }
  
  /*[NEW] add HTML from allTagsHTML to tagList */
  
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData)
}

generateTags();

// Tag click handler

function tagClickHandler(event){
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');
  console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');
  console.log(tag);

  /* find all tag links with class active */

  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */

  for(let tagLink of tagLinks){

    /* remove class active */
    
    tagLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinksHref = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */

  for(let tagLinkHref of tagLinksHref){

    /* add class active */

    tagLinkHref.classList.add('active');
  
    /* END LOOP: for each found tag link */
  
  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
  console.log(generateTitleLinks); 
}

function addClickListenersToTags(){
 
  /* find all links to tags */

  const linksToTags = document.querySelectorAll('a[href^="#tag-"]');
  
  /* START LOOP: for each link */
  
  for(let link of linksToTags){
  
    /* add tagClickHandler as event listener for that link */
  
    link.addEventListener('click', tagClickHandler);
  
  /* END LOOP: for each link */
  }
}
addClickListenersToTags();

function calculateAuthorsParams(authors){
  const params = {max: 0, min: 999999};
  for(let author in authors){
    console.log(author + 'is used' + authors[author] + 'times');
    params.max = Math.max(authors[author], params.max);
    params.min = Math.min(authors[author], params.min);
  }

  return params;
}

function calculateAuthorsClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
}


// Generate authors

function generateAuthors(){
  /* [NEW] create a new variable allAuthors with an empty array */
  
  let allAuthors = {};

  /* find all articles */
  
  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);
  
  /* START LOOP: for every article: */
  
  for(let article of articles){
  
    /* find authors wrapper */
  
    const authorsWrapper = article.querySelector(optArticleAuthorsSelector);
    console.log(authorsWrapper);
  
    /* make html variable with empty string */
  
    let html = '';
  
    /* get author from data-authors attribute */
  
    const articleAuthors = article.getAttribute('data-authors');
    
    /* generate HTML of the link */

    const linkHTMLData = {id: articleAuthors, title: articleAuthors};
    const authorLinkHTML = templates.authorLink(linkHTMLData);
    /*const authorLinkHTML = '<a href="#author-' + articleAuthors + '"><span> ' + articleAuthors + '</span></a>';

    /* add generated code to html variable */

    html = html + authorLinkHTML;

    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors[articleAuthors]){
      /* [NEW] add generated code to allAuthors array */
      allAuthors[articleAuthors] = 1;
    } else {
      allAuthors[articleAuthors]++;
    }

    /* insert HTML of all the links into the authors wrapper */
  
    authorsWrapper.innerHTML = html;
  
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const authorList = document.querySelector('.authors');

  const authorsParams = calculateAuthorsParams(allAuthors);
  console.log('authorsParams:', authorsParams);

  /* [NEW] create variable for all links HTML code */
  const allAuthorsData = {authors: []};

  /* [NEW] START LOOP: for each tag in allAuthors: */
  for(let articleAuthor in allAuthors){
  /* [NEW] generate code of a link and add it to allAuthorsHTML */
  allAuthorsData.authors.push({
    author: articleAuthor,
    count: allAuthors[articleAuthor],
    className: calculateAuthorsClass(allAuthors[articleAuthor], authorsParams)
  });
  
  /* [NEW] END LOOP: for each tag in allTags: */
  }
  /*[NEW] add HTML from allTagsHTML to tagList */
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}
generateAuthors();



function authorClickHandler(event){

  /* prevent default action for this event */
  
  event.preventDefault();
  
  /* make new constant named "clickedElement" and give it the value of "this" */
  
  const clickedElement = this;
  
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  
  const href = clickedElement.getAttribute('href');
  console.log(href);
  
  /* make a new constant "author" and extract author from the "href" constant */
  
  const author = href.replace('#author-', '');
  console.log(author);
  
  /* find all author links with class active */
  
  const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  
  /* START LOOP: for each active author link */
  
  for(let authorLink of authorLinks){
  
    /* remove class active */
    authorLink.classList.remove('active');
    /* END LOOP: for each active author link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  
  const authorLinksHref =document.querySelectorAll('a[href="' + href + '"]');
  
  /* START LOOP: for each found tag link */
  
  for(let authorLinkHref of authorLinksHref){
  
    /* add class active */
  
    authorLinkHref.classList.add('active');
    
    /* END LOOP: for each found tag link */
    
  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-authors="' + author + '"]');
}
  
function addClickListenersToAuthors(){
   
  /* find all links to tags */
  
  const linksToAuthors = document.querySelectorAll('a[href^="#author-"]');
    
  /* START LOOP: for each link */
    
  for(let link of linksToAuthors){
    
    /* add authorClickHandler as event listener for that link */
    
    link.addEventListener('click', authorClickHandler);
    
    /* END LOOP: for each link */
  }
}
addClickListenersToAuthors();


