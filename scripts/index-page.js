

const commentSectionContainer = document.getElementById("commentSectionContainer");

const commentForm = document.getElementById("commentForm");
// const commentSubmitButton = document.getElementById("commentSubmit");

// You must have an array in JavaScript with 3 default comment objects to start. Comments must have a name, a timestamp, and the comment text.
let comments = [
    {
        avatarUrl: "",
        displayName: "Connor Walton",
        text: "This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains.",    
        timestamp: "02/17/2021",
    },
    {
        avatarUrl: "",
        displayName: "Emilie Beach",
        text: "I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day.",    
        timestamp: "01/09/2021",
    },
    {
        avatarUrl: "",
        displayName: "Miles Acosta",
        text: "I can t stop listening. Every time I hear one of their songs the vocals it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can t get enough.",
        timestamp: "12/20/2020",
    }
];

// You must have a function called displayComment() that takes in one comment object as a parameter and displays it on the page using JavaScript DOM manipulation.
//  (All dynamic HTML should be added to DOM via DOM Methods for individual elements. Avoid bulk assigning stringified HTML using innerHTML)
function displayComment(comment){
    let commentElement = document.createElement("article");
    commentElement.classList.add("comment");

    ///Avatar / Left
    
    let avatarElement = document.createElement("img");
    avatarElement.classList.add("avatar");
    avatarElement.setAttribute("src",comment.avatarUrl);

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


    
    ///And then append everything? I dunno the best order for when to
    //Append content's children
    contentElement.append(nameElement,timestampElement,textElement);
    //Append avatar and content to the comment
    commentElement.append(avatarElement,contentElement);
    //Append the comment to the list
    commentSectionContainer.append(commentElement);



    ///Also append an <hr> until we get a better system going
    commentSectionContainer.appendChild(document.createElement("hr"));
}

/* TODO:
    -Use event.target.reset() to reset the form
    -Look into accessing form elements using event.target.fieldName
*/

///Register comment submissions event
commentForm.addEventListener('submit',(e) =>{
    e.preventDefault(); ///Prevent submission reload

    ///Collect form elements
    const nameElement = commentForm.elements["commentName"];
    const textElement =  commentForm.elements["commentText"];

    //Reset validity state on the elements (before each submission attempt)
    nameElement.classList.remove("invalid");
    textElement.classList.remove("invalid");

    //Validate values
    if(nameElement.value.length > 0 && textElement.value.length > 0){

        ///Build comment object

        let comment = {
            avatarUrl: "",
            displayName: commentForm.elements["commentName"].value,
            text: commentForm.elements["commentText"].value,
            // timestamp: `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`
            timestamp: new Date().toLocaleDateString("en-US",{ month: "2-digit",day: "2-digit",year:"numeric" })
        };

        ///Display the comment
        displayComment(comment);

        
        //Clear the form
        commentForm.elements["commentName"].value = "";
        commentForm.elements["commentText"].value = "";
    }
    //Mark invalid fields
    else{
        if(nameElement.value.length === 0){
            nameElement.classList.add("invalid");
        }
        if(textElement.value.length === 0){
            textElement.classList.add("invalid");
        }
    }
});


function loadComments(){
    for(let comment of comments){
        displayComment(comment);
    }
}

loadComments();