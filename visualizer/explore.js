
// Data file

// BASE_DIR = "../data";
BASE_DIR = "https://raw.githubusercontent.com/discrn/data/main"

DATA_FILE = "data_public.js"; // default, answers for testmini, no answer for test

// Variables for the filters with the number of questions
let number_options = [20, 50, 100, 200];    
let question_types = ["All", "MC2", "MC3", "MC4"];
let selection_types = ["All", "High Similarity", "Random"];
let categories = ["All", "Emotions & Sentory Experiences", "Time, Space & Location", "Motion & Physical Activity", "Audio, Sound & Music", "Environmental & Scene Context", "Threats, Risks & Safety", "Humans, Animals & Social Behavior", "Objects, Tools & Technology", "Other"];
let answer_types = ["All", "Audio", "Video", "3D ", "Image"];
// let source_types = ["All", "Audio+Video ()", "Video ()", "3D  ()", "Image ()",];

// Elements in the Option Panel
let optbtn = document.getElementsByClassName("optionsbtn")[0];
let closebtn = document.getElementsByClassName("closebtn")[0];
let optionpanel = document.getElementById("option-panel");
let optboxes = document.getElementsByClassName("optbox");
let opt_dds = document.getElementsByClassName("opt-dd");
let filter_submit = document.getElementById("filter-submit");

// Element Text the Option Panel
let number_dd = make_dropdown("How many samples?", number_options, "number_dd");
let question_type_dd = make_dropdown("Choose a question type:", question_types, "question_type_dd");
let answer_type_dd = make_dropdown("Choose an answer type:", answer_types, "answer_type_dd");
// let source_dd = make_dropdown("Choose a source dataset:", sources, "source-dd");
let category_dd = make_dropdown("Choose a category:", categories, "category_dd");
let selection_dd = make_dropdown("Choose a sampling method:", selection_types, "selection_type");

// Content in the Option Box
optboxes[0].innerHTML += number_dd;
optboxes[0].innerHTML += question_type_dd;
optboxes[0].innerHTML += answer_type_dd;
// optboxes[0].innerHTML += source_dd;
optboxes[0].innerHTML += category_dd;
optboxes[0].innerHTML += selection_dd;

// Elements in the Content Body
let body = document.getElementById("content-body");
let display = document.getElementById("display");

// Click actions for the option buttons
optbtn.addEventListener("click", openNav);
closebtn.addEventListener("click", closeNav);

// Responsive: if screen is narrow, body only displays one column
if (window.innerWidth < 600) {
    body.style.flexDirection = "column";
}

// Set up the data filters and display the page
let filters = {};

for (each of opt_dds) {
    each.addEventListener("change", change_filters);
}

// Display the page when clicking the fresh button
filter_submit.addEventListener("click", filter_data);
if (window.innerWidth < 600) {
    filter_submit.addEventListener("click", closeNav);
}

// Display the page when it is running at the first time
filter_data();

// Functions
var display_padding = display.style.padding;
function openNav() {
    if (window.innerWidth < 600) {
        // optionpanel.style.zIndex = "2";
        optionpanel.style.width = "100vw";
        display.style.width = "0vw";
        display.style.padding = "0";
    } else {
        optionpanel.style.width = "30vw";
        display.style.width = "50vw";
    }
    for (each of optionpanel.children) 
        each.style.display = "block";
}

function closeNav() {
    // display.style.display = "block";
    optionpanel.style.width = "0vw";
    display.style.width = "100vw";
    display
    for (each of optionpanel.children) {
        each.style.display = "none";
    }
}

// Function: update the filter values
function change_filters(e) {
    // filters.source = document.getElementById("source-dd").value;
    filters.number = document.getElementById("number_dd").value;
    filters.question_type = document.getElementById("question_type_dd").value;
    filters.answer_type = document.getElementById("answer_type_dd").value;
    filters.category = document.getElementById("category_dd").value;
    filters.task = document.getElementById("selection_type").value;
    // console.log(filters);
}

// Function: draw the page
function create_page(d) {
    if (d.length === 0) {
        body.innerHTML = "<p>No number satisfies All the filters.</p>";
    } else {
        col1 = create_col(d.slice(0, d.length / 2));
        col2 = create_col(d.slice(d.length / 2));
        body.innerHTML = col1 + col2;
    }
    reflow(body);
    console.log("reflowed");
}

function create_col(data) {
    res = [];

    for (each of data) {
        res.push(create_number(each));
    }

    return `<div class="display-col"> ${res.join("")} </div>`;
}

// data is an object with the following attr.
function create_number(data) {
    let question = make_qt(data.pid, data.question, null);
    // let hint = make_hint(data.hint)
    let box_data = [question];

    let choices = [];
    for (let i = 0; i < data.examples.length; i++) {
        choices.push(String.fromCharCode('A'.charCodeAt(0) + i));
    }
    choices = make_choices(choices);
    box_data.push(choices);


    let i = 0;
    for (each in data.examples) {
        if (data.examples[each].modality === "audio") {
            start = data.examples[each].meta.start_time;
            end = data.examples[each].meta.end_time;
            box_data.push(make_audio(data.examples[each].url, start, end, String.fromCharCode('A'.charCodeAt(0) + i)));
        } else if (data.examples[each].modality === "pc") {
            box_data.push(make_3d(data.examples[each].url, String.fromCharCode('A'.charCodeAt(0) + i)));
        } else if (data.examples[each].modality === "image") {
            box_data.push(make_img(data.examples[each].url, String.fromCharCode('A'.charCodeAt(0) + i)));
        } else if (data.examples[each].modality === "video") {
            start = data.examples[each].meta.start_time;
            end = data.examples[each].meta.end_time;
            box_data.push(make_video(data.examples[each].url, start, end, String.fromCharCode('A'.charCodeAt(0) + i)));
        }
        i+=1;

    }


    // if data has the answer attr.
    let answer = "";
    if ("answer" in data)
        answer = make_answer(data.answer);

    box_data.push(answer);
    html = make_box(box_data) + "<hr/>";

    return html;
}

// creates a div with question text in it
function make_qt(pid, question, unit) {
    let html = "";
    if (unit === null)
        html = `
                <p><b>Question </b></p>
                <p class="question-txt">[No.${pid}] ${question}</p>
        `;
    else
        html = `
                <p><b>Question </b></p>
                <p class="question-txt">[No.${pid}] ${question} (unit: ${unit})</p>
        `;
    return html;
}

function make_hint(hint) {
    if (hint === null) return "";
    let html = `<p><b>Context </b></p><p class="hint-txt">${hint}</p>`;
    return html;
}

function make_img(path, choice_txt) {
    if (path === null) return "";
    let html = `<div style="border:2px solid Gainsboro; margin: 10px; padding: 5px;"><p>Scene ${choice_txt}.&nbsp;&nbsp;</p><img crossorigin="anonymous" src="${path}" alt="number image" class="question-img" /></div>`;
    return html;
}

function make_video(path, choice_txt, start = null, end = null) {
    if (!path) return "";

    // Extract YouTube video ID
    let youtubeId = null;
    const watchMatch = path.match(/v=([^&]+)/);
    const embedMatch = path.match(/embed\/([^?&]+)/);

    if (watchMatch) {
        youtubeId = watchMatch[1];
    } else if (embedMatch) {
        youtubeId = embedMatch[1];
    }

    if (!youtubeId) return "Invalid YouTube URL";

    // Construct embed URL
    let embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
    let params = [];
    if (start !== null) params.push(`start=${start}`);
    if (end !== null) params.push(`end=${end}`);
    params.push("autoplay=0");

    if (params.length > 0) {
        embedUrl += "?" + params.join("&");
    }

    // Final HTML block
    let html = `
    <div style="border:2px solid Gainsboro; margin: 10px; padding: 5px;">
        <p>Scene ${choice_txt}.&nbsp;&nbsp;</p>
        <iframe
            frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            src="${embedUrl}"
            alt="number video"
            class="question-img"
            width="560"
            height="315"
        ></iframe>
    </div>`;
    
    return html;
}

var audio_index = 0
// function make_audio(path) {
//     if (path === null) return "";
//     // var youtube_id = path.split("v=")[1];
//     // console.log(youtube_id);
//     // html = `<div id="player${audio_index}" style="display:none;" value=${youtube_id}></div>`
//     path = path.replace("&start", "?start");
//     path = path.replace("end", "amp;end");
//     let path1 = path.replace("watch?v=", "v/");
//     let path2 = path.replace("watch?v=", "embed/");
//     let html = `<iframe frameborder="0" width ="361" height="25" overflow="hidden" allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" src="${path}" alt="number video" class="audio"></iframe>`;
//     // let html = `<object  filter="brightness(0%)" width ="361" height="25" overflow="hidden"><param name="movie" value="${path1}?fs=1&amp;hl=en_US"></param><param name="allowFullScreen" value="false"></param><param name="allowscriptaccess" value="always"></param><embed src="${path2}" allowscriptaccess="always" allowfullscreen="false" width="480" height="25" overflow="hidden" filter="brightness(0%)"></embed></object>`
//     // let html = `<audio controls> <source src="${path}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
//     return html;
// }


function onPlayerReady(event) {
    console.log('Player is ready');
}

function make_audio(path, start, end, choice_txt) {
    if (!path) return "";

    // Extract YouTube video ID
    let youtubeId = null;
    const watchMatch = path.match(/v=([^&]+)/);
    const embedMatch = path.match(/embed\/([^?&]+)/);

    if (watchMatch) {
        youtubeId = watchMatch[1];
    } else if (embedMatch) {
        youtubeId = embedMatch[1];
    }

    if (!youtubeId) return "Invalid YouTube URL";

    // Construct embed path
    path = `https://www.youtube.com/embed/${youtubeId}?start=${start}&end=${end}&autoplay=0`;

    let html = `
    <div style="border:2px solid Gainsboro; margin: 10px; padding: 5px;">
        <p>Scene ${choice_txt}.&nbsp;&nbsp;</p>
        <div id="playerContainer${youtubeId}">
            <iframe id='${youtubeId}-audio' frameborder="0" width="1" height="1"
                src="${path}" allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen alt="number video" style="overflow: hidden;"></iframe>
            <button id='${youtubeId}-play' onclick="playVideo('${youtubeId}')">
                <img src="../static/images/play-button-arrowhead.svg" alt="Button Image" style="height: 20px; width: 20px;">&nbsp;Play Audio
            </button>
            <button id='${youtubeId}-stop' onclick="stopVideo('${youtubeId}')" style="display: none;">
                <img src="../static/images/pause.svg" alt="Button Image" style="height: 20px; width: 20px;">&nbsp;Stop Audio
            </button>
        </div>
    </div>`;
    return html;
}

function onPlayerReady(event) {
    // Placeholder for any actions after the player is ready
}

// Function to play the video for a specific player
function playVideo(index) {
    console.log(document.getElementById(`${index}-audio`))
    document.getElementById(`${index}-audio`).src = document.getElementById(`${index}-audio`).src.replace("autoplay=0","autoplay=1");
    console.log( document.getElementById(`${index}-audio`))
    document.getElementById(`${index}-play`).style.display = 'none'
    document.getElementById(`${index}-stop`).style.display = 'block'

}

// Function to stop the video for a specific player
function stopVideo(index) {
    document.getElementById(`${index}-audio`).src = document.getElementById(`${index}-audio`).src.replace("autoplay=1","autoplay=0");
    document.getElementById(`${index}-play`).style.display = 'block'
    document.getElementById(`${index}-stop`).style.display = 'none'
}



function make_3d(path, choice_txt) {
    if (path === null) return "";
    let html = `<div style="border:2px solid Gainsboro; margin: 10px; padding: 5px;"><p>Scene ${choice_txt}.&nbsp;&nbsp;</p><iframe class="question-img" src="${path}" frameborder="0" allow="autoplay; fullscreen" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe></div>`;
    return html;
}

function make_box(contents, cls = "") {
    if (contents.join("").length === 0) return "";
    let html = `
        <div class="box ${cls}"> 
            ${contents.join(" ")}
        </div>
    `;
    return html;
}

function make_choices(choices) {
    // console.log(choices);
    // let temp = "";
    // let len = 0;
    // for (each of choices) {
    //     let html = make_choice(each);
    //     temp += html;
    //     len += each.length;
    // }
    // let html = "";
    // if (len < 60)
    html = `<p><b>Choices </b></p>`;
    // else
    //     html = `<p><b>Choices </b></p>`;
    return html;
}
function make_choice(choice) {
    let html = `<p>${choice}</p>`;
    return html;
}

function make_answer(answer) {
    let html = `<p><b>Answer </b></p><p class="answer-txt">${answer}</p>`;
    return html;
}

function make_dropdown(label, options, id, default_ind = 0) {
    let html = "";
    for (let i = 0; i < options.length; i++) {
        if (i === default_ind)
            html += `<option value="${options[i]}" selected> ${options[i]} </option>`;
        else
            html += `<option value="${options[i]}"> ${options[i]} </option>`;
    }
    html = `<label class="dd-label">${label} <select id="${id}" class="opt-dd"> ${html} </select> </label><br/>`;
    return html;
}


// Main Functions (FIXME: need to be updated)
async function filter_data() {
    // set up or update the filter
    change_filters();
    
    // success event 
    let scriptEle = document.createElement("script");
    // scriptEle.setAttribute("src", `data/${filters.dataset}_test.js`);
    scriptEle.setAttribute("src", `data/${DATA_FILE}`);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", false);
    document.body.appendChild(scriptEle);

    scriptEle.addEventListener("load", () => {
        console.log("File loaded");
        res = test_data;

        // go over res and add pid to each element
        for (let i of Object.keys(res)) {
            res[i].pid = i;
        }
        // filter: question type
        filters.question_type = filters.question_type.split(" (")[0];
        if (filters.question_type !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].question_type !== filters.question_type) {
                    delete res[i];
                }
            }
        }

        // filter: answer type
        filters.answer_type = filters.answer_type.split(" (")[0];
        if (filters.answer_type !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].answer_type !== filters.answer_type) {
                    delete res[i];
                }
            }
        }


        // filter: category
        filters.category = filters.category.split(" (")[0];
        if (filters.category !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].category !== filters.category) {
                    delete res[i];
                }
            }
        }
    
        // filter: task
        filters.task = filters.task.split(" (")[0];
        if (filters.task !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].selection_type !== filters.task) {
                    delete res[i];
                }
            }
        }

      
        // filter: number
        cnt = filters.number;
        if (cnt != "All") {
            cnt = Number.parseInt(cnt);
            d = _.sample(res, Math.min(cnt, Object.keys(res).length));

        } else {
            d = [];
            for (let i of Object.keys(res)) {
                d.push(res[i]);
            }
        }

        // for (each of d) {
        //     console.log(d);
        // }
        create_page(d);
    });
}

// force the browser to reflow
function reflow(elt) {
    elt.offsetHeight;
}
