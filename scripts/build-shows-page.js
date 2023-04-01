/**
 * Configuration settings for the comments section.
 */
const config = {
    /**
     * The api key used with the server api
     */
    api_key: "2c2bfd22-7094-4674-9868-739f6fe3979b",
    /**
     * The url of the server api endpoint 
     */
    endpointUrl: "https://project-1-api.herokuapp.com/showdates/",
};

/**
 * @typedef {object} Concert
 * @property {number} id - A unique identifier for this concert
 * @property {number} date - The date of the concert (in ms since epoch)
 * @property {string} place - The concert venue
 * @property {string} location - The geographic location of the concert
 */

/**
 * The list of concerts (aka shows)
 * @type {Concert[]}
 */
let concerts = [];

/**
 * The shows table body, which is the parent of the rows in the table
 * @type {HTMLDivElement}
 */
let showsTableBody;

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
    
    for(let columnName of ["DATE","VENUE","LOCATION",""]){
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
        cellElement.append(headerElement);
    }

    ///Append the content
    cellElement.append(content);

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
 * Creates a show row element for the show and appends it to the table
 * @param {Concert} show - The show to create the row for.
 */
function displayShow(show){
    const rowElement = document.createElement("div");
    rowElement.classList.add("shows-table__row");
    rowElement.dataset.showId = show.id;

    //Create Cells
    let dateCell = createCell(new Date(show.date).toDateString(),"DATE");
    dateCell.classList.add("shows-table__cell--strong");
    let venueCell = createCell(show.place,"VENUE");
    let locationCell = createCell(show.location,"LOCATION");
    let buttonCell = createCell(createButton("BUY TICKETS"));

    //Append cells to row
    rowElement.append(dateCell,venueCell,locationCell,buttonCell);

    //Append row to table body
    showsTableBody.appendChild(rowElement);

    //Add the click event listener for selecting the row
    rowElement.addEventListener("click",() => setSelectedRow(rowElement));
}

/**
 * Invokes {@link displayShow} for all {@link concerts}.
 */
function displayAllShows(){
    for(let show of concerts){
        displayShow(show);
    }
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
 * Download shows from ${@link config.endpointUrl} and store them in {@link concerts}, then invoke {@link displayAllShows}
 */
function downloadShows(){
    axios.get(`${config.endpointUrl}?api_key=${config.api_key}`)
        .then(response => {
            concerts.push(...response.data);
            displayAllShows();
        })
        .catch(error => console.error(error));
}

//Initialization
buildShowsSection();
downloadShows();