const showsTableBody = document.getElementById("showsTableBody");

let shows = [
    {
        date: "Mon Sept 06 2021", ///TODO, maybe convert format
        venue: "Ronald Lane",
        location: "San Francisco, CA"
    },
    {
        date: "Tue Sept 21 2021 ", ///TODO, maybe convert format
        venue: "Pier 3 East ",
        location: "San Francisco, CA"
    },
    {
        date: "Fri Oct 15 2021 ", ///TODO, maybe convert format
        venue: "View Lounge",
        location: "San Francisco, CA"
    },
    {
        date: "Sat Nov 06 2021 ", ///TODO, maybe convert format
        venue: "Hyatt Agency",
        location: "San Francisco, CA"
    },
    {
        date: "Fri Nov 26 2021", ///TODO, maybe convert format
        venue: "Moscow Center",
        location: "San Francisco, CA"
    },
    {
        date: "Wed Dec 15 2021 ", ///TODO, maybe convert format
        venue: "Press Club",
        location: "San Francisco, CA"
    },
];

/**
 * @summary Creates a table cell with specified content and optional header
 * @param {string|HTMLElement} content - The text or element in the cell
 * @param {string} [header] - The header text, if a header is to be included
 * @returns {HTMLElement}
 */
function createCell(content,header){
    const cellElement = document.createElement("div");
    cellElement.classList.add("shows-table__cell");

    if(header !== undefined){
        ///Create header element
        const headerElement = document.createElement("h4");
        headerElement.classList.add("shows-table__cell-header");

        ///Append it
        cellElement.appendChild(headerElement);
    }

    ///if content is a string:  create and append a text node for that content
    if(typeof content === 'string'){
        cellElement.appendChild(document.createTextNode(content));
    }
    ///Else:    we'll assume it's an HTML Element.  (We could type check with instanceof HTMLElement if we needed additional validation)
    else{
        cellElement.appendChild(content);
    }

    return cellElement;
}


function createButton(textContent){
    const buyButton = document.createElement("button");
    buyButton.classList.add("shows-table__button");

    buyButton.innerText = textContent;

    return buyButton;
}

function createDivider(){
    const divider = document.createElement("hr");
    divider.classList.add("divider");

    return divider;
}


function addShow(show){
    const rowElement = document.createElement("div");
    rowElement.classList.add("shows-table__row");

    ///Create Cells
    let dateCell = createCell(show.date,"DATE");
    let venueCell = createCell(show.venue,"VENUE");
    let locationCell = createCell(show.location,"LOCATION");
    let buttonCell = createCell(createButton("BUY TICKETS"));

    ///Append cells to row
    rowElement.append(dateCell,venueCell,locationCell,buttonCell);

    ///Append row to table body
    showsTableBody.appendChild(rowElement);

    ///Create and append an hr.divider
    showsTableBody.appendChild(createDivider());
}


for(let show of shows){
    addShow(show);
}