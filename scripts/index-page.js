/**
 * Configuration settings for the comments section.
 */
const config = {
    /**
     * If true timestamps will be displayed relative. E.g. 3 years ago.
     * Otherwise they will be displayed as dates.
     */
    useRelativeTimestamps: true,
    /**
     * The time -in seconds- between comments section reloads. 0 indicates never.
     */
    refreshRate: 7.5,
};


/**
 * @typedef {object} CommentObject
 * @property {string} displayName - The name of the commenter
 * @property {string} text - The text content
 * @property {string} timestamp - The date posted
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
 * The page comments
 * (Ordered chronology so the oldest comments are at the start)
 * @type {CommentObject[]}
 */
let comments = [
    {
        displayName: "Miles Acosta",
        text: "I can t stop listening. Every time I hear one of their songs the vocals it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can t get enough.",
        timestamp: "12/20/2020, 12:00:00 PM",
    },
    {
        displayName: "Emilie Beach",
        text: "I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day.",    
        timestamp: "01/09/2021, 12:00:00 PM",
    },
    {
        displayName: "Connor Walton",
        text: "This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains.",    
        timestamp: "02/17/2021, 12:00:00 PM",
    },
];


/**
 * Create and append a comment element to the comments section
 * @param {CommentObject} comment - A comment to be displayed
 */
function displayComment(comment){
    let commentElement = document.createElement("article");
    commentElement.classList.add("comment");

    //Avatar / Left
    
    let avatarElement = document.createElement("img");
    avatarElement.classList.add("avatar");

    //Content / Right

    let contentElement = document.createElement("div");
    contentElement.classList.add("comment__content");

    let nameElement = document.createElement("h4");
    nameElement.classList.add("comment__name");
    nameElement.innerText = comment.displayName;

    let timestampElement = document.createElement("span");
    timestampElement.classList.add("comment__timestamp");
    if(config.useRelativeTimestamps){
        timestampElement.innerText = getRelativeTimestamp(comment.timestamp);
    }else{
        timestampElement.innerText = comment.timestamp.substring(0,comment.timestamp.indexOf(","));
    }

    let textElement = document.createElement("p");
    textElement.classList.add("comment__text");
    textElement.innerText = comment.text;
    
    //Append content's children
    contentElement.append(nameElement,timestampElement,textElement);
    //Append avatar and content to the comment
    commentElement.append(avatarElement,contentElement);
    //Append the comment to the list
    commentSectionContainer.append(commentElement);

    //Create and append divider
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
 * Converts a date to a human-readable relative formated string.
 * @param {(string|Date)} date - The date to be compared to now
 * @returns {string} The relative date string. E.g. 2 seconds ago, 3 minutes ago, or 1 year ago
 */
function getRelativeTimestamp(date){
    const toAgoString = (unit,number) => `${Math.ceil(number)} ${unit}${Math.ceil(number)!==1?"s":""} ago`;
    
    if(typeof date === 'string'){
        date = new Date(date);
    }
    let now = new Date();

    let difference = now - date; ///In milliseconds

    let seconds = difference/1000;
    if(seconds < 60)return toAgoString("second",seconds);

    let minutes = seconds / 60;
    if(minutes < 60)return toAgoString("minute",minutes);
    
    let hours = minutes / 60;
    if(hours < 24)return toAgoString("hour",hours);
    
    let days = hours / 24;
    if(days < 7)return toAgoString("day",days);

    let weeks = days / 7;
    if(days < 30)return toAgoString("week",weeks);

    let months = days / 30;
    if(months < 12)return toAgoString("month",months);

    let years = months / 12;
    return toAgoString("year",years);
    
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
    //Iterate through comments in reverse (newest -> oldest)
    for(let i=comments.length-1;i>=0;i--){
        displayComment(comments[i]);
    }
}

//Register comment submissions event
commentForm.addEventListener('submit',(e) =>{
    e.preventDefault(); ///Prevent submission reload

    //Collect values
    let name = e.target.commentName.value;
    let text = e.target.commentText.value;
    
    //Validation 
    //Reset valid state for inputs
    [...e.target.elements].forEach(formElement => formElement.classList.remove("form-field__field--invalid"));

    let validInput = true;
    if(name.length === 0){
        e.target.commentName.classList.add("form-field__field--invalid");
        validInput=false;
    }
    if(text.length === 0){
        e.target.commentText.classList.add("form-field__field--invalid");
        validInput=false;
    }
    //If any fields were invalid, return
    if( !validInput ){
        return;
    }
    
    //Build comment object
    let comment = {
        displayName: commentForm.elements["commentName"].value,
        text: commentForm.elements["commentText"].value,
        timestamp: new Date().toLocaleDateString("en-US",{ month: "2-digit",day: "2-digit",year:"numeric", hour: "2-digit",minute:"2-digit",second:"2-digit" })
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

//Setup refresh inverval if enabled
if(config.refreshRate){
    setInterval(()=>{
        clearComments();
        loadComments();
    }, config.refreshRate * 1000);
}