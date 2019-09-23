
//Start the Project on load
initScript();

function initScript(){
    getAllEvents(); 
}

//Print values in Timeline using Cards
function buildTimeline(values) {
    for (i in values) {

        let listEventsDOM = document.getElementById("eventList");

        let cardComponent = document.createElement("div");
        cardComponent.innerHTML = "<div class=\"container right\">\n" +
        "    <div class=\"content\">\n" +
        "        <div class=\"row head\">\n" +
        "            <div class=\"column\">\n" +
        "                <div><div class=\"icon calendar\"></div>"+ dateFormatDayMonthYear(values[i].date)+"</div>\n" +
        "            </div>\n" +
        "            <div class=\"column\">\n" +
        "                <div><div class=\"icon clock\"></div>"+ dateFormatHourMinute(values[i].date)+"</div>\n" +
        "            </div>\n" +
        "            <div class=\"column\">\n" +
        "                <div class=\"text-split\"><div class=\"icon place\"></div>"+ (values[i].store_name || "") +"</div>\n" +
        "            </div>\n" +
        "            <div class=\"column\">\n" +
        "                <div><div class=\"icon money\"></div>"+ "R$" + values[i].product_price +"</div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"flex-container \">\n" +
        "            <div class=\"left-card-content pl-40\">\n" +
        "                <div class=\"bold-text pl-40 pt-10  pb-10 text-left\">\n" +
        "                    Produto\n" +
        "                </div>\n" +
        "                <div class=\"pl-40  pt-10  pb-10  t-border text-left \">\n" +
        "                    "+ values[i].product_name +"\n" +
        "                </div>\n" +
        "\n" +
        "            </div>\n" +
        "            <div class=\"right-card-content pr-40\">\n" +
        "                <div class=\"bold-text pr-40  pt-10  pb-10  pt-10 pb-10 text-left\">\n" +
        "                    Preço\n" +
        "                </div>\n" +
        "                <div class=\"pr-40   pt-10  pb-10 t-border text-left\">\n" +
        "                     "+"R$" + values[i].product_price +"\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";
        listEventsDOM.appendChild(cardComponent);


        
    }
}

//Business rules
function orderByTransaction(array) {

    let groupedArray = [];
    let customObjectTemp = {};
    let newItem = true;

    for (i in array.events) {

        for (x in array.events[i].custom_data) {

            if (typeof array.events[i].custom_data[x] != 'undefined') {
                if (array.events[i].custom_data[x].key == "transaction_id") {
                    customObjectTemp.transaction_id = array.events[i].custom_data[x].value;
                }

                if (array.events[i].custom_data[x].key == "product_name") {
                    customObjectTemp.product_name = array.events[i].custom_data[x].value;
                }
                if (array.events[i].custom_data[x].key == "product_price") {
                    customObjectTemp.product_price = array.events[i].custom_data[x].value;
                }
                if (array.events[i].custom_data[x].key == "store_name") {
                    customObjectTemp.store_name = array.events[i].custom_data[x].value;
                }

            }

            if (array.events[i].custom_data.length == Object.keys(customObjectTemp).length) {

                customObjectTemp.date = array.events[i].timestamp;

                for (let i = 0; i < groupedArray.length; i++) {
                    if (groupedArray[i].transaction_id == customObjectTemp.transaction_id) {

                        if (customObjectTemp.product_name) {
                            groupedArray[i].product_name != customObjectTemp.product_name ? newItem = true : newItem = false;
                        }

                        if (!groupedArray[i].product_name) {
                            groupedArray[i].product_name = customObjectTemp.product_name;
                        }

                        if (!groupedArray[i].product_price) {
                            groupedArray[i].product_price = customObjectTemp.product_price;
                        }

                        if (!groupedArray[i].store_name) {
                            groupedArray[i].store_name = customObjectTemp.store_name;
                        }
                    }
                }

                if (!customObjectTemp.hasOwnProperty("store_name") && newItem) {
                    groupedArray.push(customObjectTemp);
                }

                customObjectTemp = {};

            }

        }
    }

    //Order by date asc 
    orderbyDescendingDate(groupedArray); 
    return groupedArray;
}


/* - -  HTTP Requests - - */
function getAllEvents() {
    const API_URL = 'https://storage.googleapis.com/dito-questions/events.json';
    fetch(API_URL)
        .then(response => response.json())
        .then(data =>
            orderByTransaction(data)
        )
        .catch(function (error) {
            document.write(error);
        });
}

/*- -  Dates Functions -- */

function dateFormatHourMinute(value) {
    let date = new Date(value);
    return date.getUTCHours() + ':' + date.getUTCMinutes();
}

function dateFormatDayMonthYear(value) {
    let date = new Date(value);
    return date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
}

function orderbyDescendingDate(data) {
    data.sort(function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    });
    
    buildTimeline(data);
}



