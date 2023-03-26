/**
 * @typedef {object} Concert
 * @property {string} date - The date of the concert
 * @property {string} venue - The concert venue
 * @property {string} location - The city where the concert is located
 */

/**
 * The shows table body, which is the parent of the rows in the table
 * @type {HTMLDivElement}
 */
let showsTableBody;

/**
 * The list of concerts (aka shows)
 * @type {Concert[]}
 */
let concerts = [
    {
        date: "Mon Sept 06 2021",
        venue: "Ronald Lane",
        location: "San Francisco, CA"
    },
    {
        date: "Tue Sept 21 2021 ",
        venue: "Pier 3 East ",
        location: "San Francisco, CA"
    },
    {
        date: "Fri Oct 15 2021 ",
        venue: "View Lounge",
        location: "San Francisco, CA"
    },
    {
        date: "Sat Nov 06 2021 ", 
        venue: "Hyatt Agency",
        location: "San Francisco, CA"
    },
    {
        date: "Fri Nov 26 2021",
        venue: "Moscow Center",
        location: "San Francisco, CA"
    },
    {
        date: "Wed Dec 15 2021 ", 
        venue: "Press Club",
        location: "San Francisco, CA"
    },
];

/**
 * The currently selected row, if any
 * @type {HTMLElement|null}
 */
let selectedRow = null;


/**
 * Builds the shows section and appends it to <main>
 */
function buildShowsSection(){
    let sectionElement = document.createElement("section");
    sectionElement.classList.add("shows-section");
    
    let contentContainer = document.createElement("div");
    contentContainer.classList.add("shows-section__content-container");

    let showsHeader = document.createElement("h2");
    showsHeader.classList.add("shows-section__section-header");
    showsHeader.textContent = "Shows";

    let showsTable = document.createElement("div");
    showsTable.classList.add("shows-table");

    let tableHead = document.createElement("div");
    tableHead.classList.add("shows-table__head");
    
    for(columnName of ["DATE","VENUE","LOCATION",""]){
        let header = document.createElement("h4");
        header.classList.add("shows-table__column-header");
        header.textContent = columnName;
        tableHead.appendChild(header);
    }

    let tableBody = document.createElement("div");
    tableBody.classList.add("shows-table__body");


    //Append tableHead and body to showsTable
    showsTable.append(tableHead,tableBody);

    //Append shows header and table to content container
    contentContainer.append(showsHeader,showsTable);

    //Append contentContainer to section, and section to main
    sectionElement.append(contentContainer);
    document.querySelector("main").append(sectionElement);

    showsTableBody = tableBody;
}

/**
 * Creates a table cell with specified content and optional header
 * @param {string|HTMLElement} content - The text or element in the cell
 * @param {string} [header] - The header text, if a header is to be included
 * @returns {HTMLElement}
 */
function createCell(content,header){
    const cellElement = document.createElement("div");
    cellElement.classList.add("shows-table__cell");

    if(header !== undefined){
        //Create header element
        const headerElement = document.createElement("h4");
        headerElement.classList.add("shows-table__cell-header");
        headerElement.textContent = header;

        //Append it
        cellElement.appendChild(headerElement);
    }

    //if content is a string:  create and append a text node for that content
    if(typeof content === 'string'){
        cellElement.appendChild(document.createTextNode(content));
    }
    //Else:    we'll assume it's an HTML Element.  (We could type check with instanceof HTMLElement if we needed additional validation)
    else{
        cellElement.appendChild(content);
    }

    return cellElement;
}

/**
 * Creates a button element
 * @param {string} textContent - The text content for the button
 * @returns {HTMLButtonElement} - The created button element
 */
function createButton(textContent){
    const buyButton = document.createElement("button");
    buyButton.classList.add("shows-table__button");

    buyButton.innerText = textContent;

    return buyButton;
}

/**
 * Creates an hr.divider element
 * @returns {HTMLHRElement} - The created divider element.
 */
function createDivider(){
    const divider = document.createElement("hr");
    divider.classList.add("divider");

    return divider;
}

/**
 * Creates a show row element for the show and appends it to the table
 * @param {Concert} show - The show to create the row for.
 */
function addShow(show){
    const rowElement = document.createElement("div");
    rowElement.classList.add("shows-table__row");

    //Create Cells
    let dateCell = createCell(show.date,"DATE");
    dateCell.classList.add("shows-table__cell--strong");
    let venueCell = createCell(show.venue,"VENUE");
    let locationCell = createCell(show.location,"LOCATION");
    let buttonCell = createCell(createButton("BUY TICKETS"));

    //Append cells to row
    rowElement.append(dateCell,venueCell,locationCell,buttonCell);

    //Append row to table body
    showsTableBody.appendChild(rowElement);

    //Add the click event listener for selecting the row
    rowElement.addEventListener("click",() => setSelectedRow(rowElement));

    //Create and append an hr.divider
    showsTableBody.appendChild(createDivider());
}

/**
 * Selects the given row element. If null is given selection is set to none.
 * @param {HTMLElement|null} rowElement 
 */
function setSelectedRow(rowElement){
    //If this is already the selectedRow, return
    if(rowElement === selectedRow){
        return;
    }

    //if there is currently a row selected, remove the selected class from it
    if(selectedRow !== null){
        selectedRow.classList.remove("shows-table__row--selected");
    }

    //Assign this as the new selectedRow
    selectedRow = rowElement;

    //If the new selectedRow is not null, add the selected class to it
    if(selectedRow !== null){
        selectedRow.classList.add("shows-table__row--selected");
    }
}

/**
 * Invokes {@link addShow} for all {@link concerts}.
 */
function loadShows(){
    for(let show of concerts){
        addShow(show);
    }
}

buildShowsSection();

loadShows();