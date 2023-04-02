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
     * The time -in seconds- between timestamp refreshes. 0 indicates never.
     */
    timestampRefreshRate: 5,
    /**
     * The api key used with the server api
     */
    api_key: "2c2bfd22-7094-4674-9868-739f6fe3979b",
    /**
     * The url of the server api endpoint 
     */
    endpointUrl: "https://project-1-api.herokuapp.com/comments/",
};

/**
 * @typedef {object} CommentObject
 * @property {string} name - The name of the commenter
 * @property {string} comment - The text content
 * @property {number} id - A unique identifier for this comment
 * @property {number} likes - like count for this comment
 * @property {number} timestamp - The date posted (in ms since epoch)
 */

const elements = {
    /**
     * The comment list element
     * @type {HTMLDivElement}
     */
    commentList: document.getElementById("commentList"),
    /**
     * The comment form element
     * @type {HTMLFormElement}
     */
    commentForm: document.getElementById("commentForm"),
    /**
     * The comment form error message element
     * @type {HTMLSpanElement}
     */
    commentFormError: document.getElementById("commentFormError")
};

/**
 * The comments section element
 * @type {HTMLDivElement}
 */

/**
 * The page comments
 * (Ordered chronology so the oldest comments are at the start)
 * @type {CommentObject[]}
 */
let comments = [];

/**
 * Create and append a comment element to the comments section
 * @param {CommentObject} comment - A comment to be displayed
 */
function displayComment(comment){
    let commentElement = document.createElement("article");
    commentElement.classList.add("comment");
    commentElement.dataset.commentId = comment.id;

    //Avatar / Left
    let avatarElement = document.createElement("img");
    avatarElement.classList.add("avatar");
    avatarElement.setAttribute("alt","avatar");
    avatarElement.setAttribute("src","");
    

    //Content / Right
    let contentElement = document.createElement("div");
    contentElement.classList.add("comment__content");

    let nameElement = document.createElement("h4");
    nameElement.classList.add("comment__name");
    nameElement.innerText = comment.name;

    let timestampElement = document.createElement("span");
    timestampElement.classList.add("comment__timestamp");
    timestampElement.dataset.timestamp = String(comment.timestamp);
    updateTimestamp(timestampElement);

    //Create icons and likes label
    let deleteElement = document.createElement("img");
    deleteElement.src = "./assets/icons/icon-delete.svg";
    deleteElement.alt = "delete";
    deleteElement.classList.add("comment__icon-button","comment__icon-button--delete");
    deleteElement.addEventListener('click',()=>deleteComment(comment.id));

    let likeElement = document.createElement("img");
    likeElement.src = "./assets/icons/icon-like.svg";
    likeElement.alt = "like";
    likeElement.classList.add("comment__icon-button","comment__icon-button--like");
    likeElement.addEventListener('click',()=>putLike(comment.id));

    let likesLabelElement = document.createElement("span");
    likesLabelElement.classList.add("comment__likes");
    likesLabelElement.innerText = `${comment.likes} like${comment.likes!==1?"s":""}`;

    //Create text element
    let textElement = document.createElement("p");
    textElement.classList.add("comment__text");
    textElement.innerText = comment.comment;
    
    //Append content's children
    contentElement.append(nameElement,timestampElement,deleteElement,likeElement,likesLabelElement,textElement);

    //Append avatar and content to the comment
    commentElement.append(avatarElement,contentElement);

    //Append the comment to the list
    elements.commentList.append(commentElement);
}

/**
 * Invokes {@link displayComment} for all {@link comments}
 */
function displayAllComments(){
    clearAllComments();
    //Iterate through comments in reverse (newest -> oldest)
    for(let i=comments.length-1;i>=0;i--){
        displayComment(comments[i]);
    }
}

/**
 * Updates the timestamp text for an element based on it's {@link HTMLElement.dataset.timestamp}
 * @param {HTMLElement} timestampElement 
 */
function updateTimestamp(timestampElement){
    let time = Number(timestampElement.dataset.timestamp);

    if(config.useRelativeTimestamps){
        timestampElement.innerText = getRelativeTimestamp(time);
    }else{
        timestampElement.innerText = new Date(time).toLocaleDateString("en-US",{ month: "2-digit",day: "2-digit",year:"numeric"});
    }
}

/**
 * Invokes {@link updateTimestamp} for all .comment__timestamp elements
 */
function updateAllTimestamps(){
    document.querySelectorAll('.comment__timestamp').forEach(element => updateTimestamp(element));
}

/**
 * Converts a date to a human-readable relative formated string.
 * @param {(number|Date)} date - The date to be compared to now
 * @returns {string} The relative date string. E.g. 2 seconds ago, 3 minutes ago, or 1 year ago
 */
function getRelativeTimestamp(date){
    const toAgoString = (unit,number) => `${Math.ceil(number)} ${unit}${Math.ceil(number)!==1?"s":""} ago`;
    
    let now = new Date();
    let difference = now - date; //In milliseconds

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
function clearAllComments(){
    elements.commentList.innerHTML = "";
}

/**
 * Download comments from ${@link config.endpointUrl} , then invoke {@link displayAllComments}
 */
function downloadComments(){
    axios.get(config.endpointUrl + "?api_key=" + config.api_key)
        .then(response => {
            //Assign comments, sorted by timestamp
            comments = response.data.sort((a,b) => a.timestamp-b.timestamp);
            displayAllComments();
        });
}

/**
 * Sends a POST request with {@link comment} to {@link config.endpointUrl}, then invokes {@link downloadComments}.
 * @summary Posts a comment
 * @param {CommentObject} comment 
 * @returns {Promise}
 */
function postComment(comment){
    return axios.post(config.endpointUrl + "?api_key=" + config.api_key, comment)
        .then(() => downloadComments());
}

/**
 * Sends a PUT request to {@link config.endpointUrl}/:id/like (where :id is the {@link commentId} specified), then invokes {@link downloadComments}.
 * @summary Likes a comment
 * @param {number} commentId - The id of the comment to like
 */
function putLike(commentId){
    axios.put(`${config.endpointUrl}${commentId}/like?api_key=${config.api_key}`)
        .then(() => downloadComments())
        .catch(() => console.error(error));
}

/**
 * Sends a DELETE request to {@link config.endpointUrl}/:id (where :id is the {@link commentId} specified), then invokes {@link downloadComments}.
 * @summary Deletes a comment
 * @param {number} commentId - The id of the comment to like
 */
function deleteComment(commentId){
    axios.delete(`${config.endpointUrl}${commentId}?api_key=${config.api_key}`)
        .then(() =>{ downloadComments(); })
        .catch(error => console.error(error));
}

/**
 * Sets the displayed error in the comment form, if any
 * @param {string} error - The error to be displayed
 */
function setDisplayedCommentFormError(error=""){
    elements.commentFormError.innerText = error ? error : "";
}

//Register comment submissions event
elements.commentForm.addEventListener('submit',(e) =>{
    e.preventDefault(); //Prevent submission reload

    //Collect values
    let name = e.target.commentName.value;
    let text = e.target.commentText.value;
    
    //Validation 
    //Reset error message
    setDisplayedCommentFormError();

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
        name: name,
        comment: text
    };

    //Post comment to the server, if successful reset the form, otherwise display an error
    postComment(comment)
        .then(()=>e.target.reset())
        .catch(error => {
            setDisplayedCommentFormError("An unexpected error occured while trying to post the comment. Please try again.");
            console.error(error);
        });

    
});


downloadComments();

//Setup refresh inverval if enabled
if(config.timestampRefreshRate){
    setInterval(()=>{
        updateAllTimestamps();
    }, config.timestampRefreshRate * 1000);
}