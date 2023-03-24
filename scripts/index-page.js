/**
 * @typedef {object} CommentObject
 * @property {string} displayName - The name of the commenter
 * @property {string} text - The text content
 * @property {timestamp} timestamp - The date posted
 */

/**
 * The comments section element
 * @type {HTMLDivElement}
 */
const commentSectionContainer = document.getElementById("commentSectionContainer");
/**
 * The comment form element
 * @type {HTMLFormElement}
 */
const commentForm = document.getElementById("commentForm");

// You must have an array in JavaScript with 3 default comment objects to start. Comments must have a name, a timestamp, and the comment text.
/**
 * @type {CommentObject[]}
 */
let comments = [
    {
        displayName: "Connor Walton",
        text: "This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains.",    
        timestamp: "02/17/2021",
    },
    {
        displayName: "Emilie Beach",
        text: "I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day.",    
        timestamp: "01/09/2021",
    },
    {
        displayName: "Miles Acosta",
        text: "I can t stop listening. Every time I hear one of their songs the vocals it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can t get enough.",
        timestamp: "12/20/2020",
    }
];


/**
 * Create and append a comment element to the comments section
 * @param {CommentObject} comment - A comment to be displayed
 */
function displayComment(comment){
    let commentElement = document.createElement("article");
    commentElement.classList.add("comment");

    ///Avatar / Left
    
    let avatarElement = document.createElement("img");
    avatarElement.classList.add("avatar");

    ///Content / Right

    let contentElement = document.createElement("div");
    contentElement.classList.add("comment__content");

    let nameElement = document.createElement("h4");
    nameElement.classList.add("comment__name");
    nameElement.innerText = comment.displayName;

    let timestampElement = document.createElement("span");
    timestampElement.classList.add("comment__timestamp");
    timestampElement.innerText = comment.timestamp;

    let textElement = document.createElement("p");
    textElement.classList.add("comment__text");
    textElement.innerText = comment.text;
    
    //Append content's children
    contentElement.append(nameElement,timestampElement,textElement);
    //Append avatar and content to the comment
    commentElement.append(avatarElement,contentElement);
    //Append the comment to the list
    commentSectionContainer.append(commentElement);

    ///Create and append divider
    generateDivider();
}

/**
 * Creates and appends a divider to the comment form
 * @returns {HTMLHRElement} - The created divider element
 */
function generateDivider(){
    let dividerElement = document.createElement("hr");
    dividerElement.classList.add("comments-section__divider");
    commentSectionContainer.appendChild(dividerElement);
    return dividerElement;
}

/**
 * Clears the comment form
 */
function clearComments(){
    //Clear comments and dividers
    commentSectionContainer.querySelectorAll(".comment, .comments-section__divider").forEach(element => element.remove());
    //Create and append a divider
    generateDivider();
}

/**
 * Invokes {@link displayComment} for all {@link comments}
 */
function loadComments(){
    for(let comment of comments){
        displayComment(comment);
    }
}


///Register comment submissions event
commentForm.addEventListener('submit',(e) =>{
    e.preventDefault(); ///Prevent submission reload

    //Collect values
    let name = e.target.commentName.value;
    let text = e.target.commentText.value;
    
    //#region Validation 
    //Reset valid state for inputs
    [...e.target.elements].forEach(formElement => formElement.classList.remove("invalid"));

    let validInput = true;
    if(name.length === 0){
        e.target.commentName.classList.add("invalid");
        validInput=false;
    }
    if(text.length === 0){
        e.target.commentText.classList.add("invalid");
        validInput=false;
    }
    //If any fields were invalid, return
    if( !validInput ){
        return;
    }
    //#endregion

    //Build comment object
    let comment = {
        avatarUrl: "",
        displayName: commentForm.elements["commentName"].value,
        text: commentForm.elements["commentText"].value,
        timestamp: new Date().toLocaleDateString("en-US",{ month: "2-digit",day: "2-digit",year:"numeric" })
    };
    //Push comment to the array
    comments.push(comment);

    //Clear and re-render comments
    clearComments();
    loadComments();

    //Clear the form
    commentForm.reset();
});


loadComments();