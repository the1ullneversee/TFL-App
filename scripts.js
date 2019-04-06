//create a new request variable and assign a new XMLHttpRequest to it.
var request = new XMLHttpRequest();

//Open a new connection, using the GET Request on the URL Endpoint
request.open('GET', 'https://api.tfl.gov.uk/Line/Mode/tube/Status', true);

const app = document.getElementById('root');
const logo = document.createElement('img');

logo.src = 'logo.png';

const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(logo);
app.appendChild(container);

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var modalContent = document.getElementById('content');
//----//
//associative array

request.onload = function () {
    var data = JSON.parse(request.response);
    if (request.status >= 200 && request.status < 400) {
        data.forEach(line => {

            console.log(line.id);
            var lineId = line.id;
            lineId.replace(/[^a-zA-Z ]/g, "");
            const h1 = document.createElement('h1');

            h1.textContent = line.name;
            h1.href = 'linePage.html';
            h1.id = lineId;

            h1.addEventListener("click", function (event) {
                DisplayLineDetails(event);
            });
            span.onClick = function () {
                modal.style.display = "none";
            }

            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }

            const p1 = document.createElement('p1');
            var lineStatus = line.lineStatuses[0].statusSeverityDescription
            p1.textContent = lineStatus;

            const card = document.createElement('div');
            if (lineStatus === "Good Service") {
                card.setAttribute('class', 'card card-green');
            } else {
                card.setAttribute('class', 'card card-yellow');
            }
            card.id = "Card_" + lineId;
            //console.log(card.id);
            container.appendChild(card);

            card.appendChild(h1);
            card.appendChild(p1);

        });
    }
    else {
        const errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Gah, it's not working!`;
        app.appendChild(errorMessage);
    }
}
request.send();

function DisplayLineDetails(event) {

    var eventId = event.target.id;
    var lineDetailsReq = new XMLHttpRequest();
    var url = 'https://api.tfl.gov.uk/Line/' + eventId + '/Route?serviceTypes=Regular';
    lineDetailsReq.open('GET', url, true);
    var table = document.createElement('table');
    table.id = 'routeTable';
    table.setAttribute('class','modalTable');
    //Create the table elements.
    var tblBody = document.createElement("tbody");

    var tr = document.createElement('tr');   
    tr.setAttribute('class', 'modalTableRow');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');

    var text1 = document.createTextNode('Destination Name');
    var text2 = document.createTextNode('Direction');
    var text3 = document.createTextNode('Name');
    var text4 = document.createTextNode('Origin');
    var text5 = document.createTextNode('Service Type');

    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    td4.appendChild(text4);
    td5.appendChild(text5);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    tblBody.appendChild(tr);
    var elementArray = [];
    //------------------------//
    lineDetailsReq.onload = function () {

        var jsonData = JSON.parse(lineDetailsReq.response);
        if (lineDetailsReq.readyState == 4 && lineDetailsReq.status == 200) {
            jsonData.routeSections.forEach(routeSection => {
                var elementArray = [];
                elementArray.push(routeSection.destinationName);
                elementArray.push(routeSection.direction);
                elementArray.push(routeSection.name);
                elementArray.push(routeSection.originationName);
                elementArray.push(routeSection.serviceType);


                var tr_route = document.createElement('tr');
                tr_route.setAttribute('class', 'modalTableRow');
                elementArray.forEach(element => {
                    console.log(element);
                    var cell = document.createElement('td');
                    cell.setAttribute('class','ModalTableTd');
                    cellText = document.createTextNode(element);
                    cell.appendChild(cellText);

                    tr_route.appendChild(cell);
                });

                tblBody.appendChild(tr_route);
            });
        }
        else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `Gah, it's not working!`;
            app.appendChild(errorMessage);
        }
    }
    table.appendChild(tblBody);
    lineDetailsReq.send();
    modal.style.display = "block";
    modalContent.appendChild(table);

}
