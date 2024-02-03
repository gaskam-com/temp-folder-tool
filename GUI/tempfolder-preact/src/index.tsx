import { hydrate, prerender as ssr } from "preact-iso";

import folderIcon from "./assets/folder.svg";
import fileIcon from "./assets/file.svg";
import searchIcon from "./assets/search.svg";
import "./style.css";
import "./app.js";

export function App() {
    return (
        <div>
            <header>
                <h1>TempFolder GUI</h1>
                <div className="nav">
                    <button>
                        <a>Explorer</a>
                    </button>
                    <button id="confettiSettings">
                        <a>Settings</a>
                    </button>
                </div>
            </header>
            <div className="search-bar">
                <input
                    type="text"
                    id="search"
                    placeholder="Search, You can use regex !"
                />
            </div>
            <div className="placeholder"></div>

            <div className="content">
                <Element
                    icon={folderIcon}
                    name="Travel_Plans.docx"
                    retention="1d 2h 30m"
                    time="02:30:00"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Family_Photos.jpeg"
                    retention="2d 5h 15m"
                    time="05:15:00"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Adventure_Video.mp4"
                    retention="3d 8h 45m"
                    time="08:45:00"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Podcast_Audio.wav"
                    retention="4d 12h 20m"
                    time="12:20:00"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Secret_Code.py"
                    retention="5d 16h 0m"
                    time="16:00:00"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="System_Backup.zip"
                    retention="6d 19h 35m"
                    time="19:35:00"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Project_Template.pptx"
                    retention="7d 23h 10m"
                    time="23:10:00"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Old_Archive.rar"
                    retention="8d 1d 2h 45m"
                    time="1:02:45"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Server_Log.txt"
                    retention="9d 1d 6h 20m"
                    time="1:06:20"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Budget_Sheet.xlsx"
                    retention="10d 1d 10h 0m"
                    time="1:10:00"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Monthly_Report.pdf"
                    retention="11d 1d 13h 35m"
                    time="1:13:35"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Sales_Presentation.ppt"
                    retention="12d 1d 17h 10m"
                    time="1:17:10"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Customer_Database.db"
                    retention="13d 2d 20h 45m"
                    time="2:20:45"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Network_Diagram.drawio"
                    retention="14d 2d 0h 20m"
                    time="2:00:20"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Internal_Message.msg"
                    retention="15d 2d 4h 0m"
                    time="2:04:00"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Meeting_Memo.doc"
                    retention="16d 2d 7h 35m"
                    time="2:07:35"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Proposal_Document.docx"
                    retention="17d 2d 11h 10m"
                    time="2:11:10"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Business_Plan.doc"
                    retention="18d 2d 14h 45m"
                    time="2:14:45"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Work_Schedule.docx"
                    retention="19d 2d 18h 20m"
                    time="2:18:20"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Legal_Contract.doc"
                    retention="20d 3d 21h 55m"
                    time="3:21:55"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Personal_Note.txt"
                    retention="21d 3d 1h 30m"
                    time="3:01:30"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Task_List.docx"
                    retention="22d 3d 5h 5m"
                    time="3:05:05"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Feedback_Form.doc"
                    retention="23d 3d 8h 40m"
                    time="3:08:40"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Financial_Report.xlsx"
                    retention="24d 3d 12h 15m"
                    time="3:12:15"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="User_Guide.docx"
                    retention="25d 3d 15h 50m"
                    time="3:15:50"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Daily_Journal.doc"
                    retention="26d 3d 19h 25m"
                    time="3:19:25"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Important_Message.msg"
                    retention="27d 4d 23h 0m"
                    time="4:23:00"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Record_Book.docx"
                    retention="28d 4d 2h 35m"
                    time="4:02:35"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Flowchart.drawio"
                    retention="29d 4d 6h 10m"
                    time="4:06:10"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Progress_Report.pdf"
                    retention="30d 4d 9h 45m"
                    time="4:09:45"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Invoice_Template.pdf"
                    retention="31d 4d 13h 20m"
                    time="4:13:20"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Feedback_Form.docx"
                    retention="32d 4d 16h 55m"
                    time="4:16:55"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Personal_Memo.doc"
                    retention="33d 4d 20h 30m"
                    time="4:20:30"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Meeting_Notes.txt"
                    retention="34d 5d 0h 5m"
                    time="5:00:05"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Proposal_Document.docx"
                    retention="35d 5d 3h 40m"
                    time="5:03:40"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Business_Plan.doc"
                    retention="36d 5d 7h 15m"
                    time="5:07:15"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Work_Schedule.docx"
                    retention="37d 5d 10h 50m"
                    time="5:10:50"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Legal_Contract.doc"
                    retention="38d 5d 14h 25m"
                    time="5:14:25"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Personal_Note.txt"
                    retention="39d 5d 18h 0m"
                    time="5:18:00"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Task_List.docx"
                    retention="40d 5d 21h 35m"
                    time="5:21:35"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Feedback_Form.doc"
                    retention="41d 5d 1h 10m"
                    time="5:01:10"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Financial_Report.xlsx"
                    retention="42d 5d 4h 45m"
                    time="5:04:45"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="User_Guide.docx"
                    retention="43d 5d 8h 20m"
                    time="5:08:20"
                ></Element>
                <Element
                    icon={folderIcon}
                    name="Daily_Journal.doc"
                    retention="44d 5d 11h 55m"
                    time="5:11:55"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Important_Message.msg"
                    retention="45d 5d 15h 30m"
                    time="5:15:30"
                ></Element>
                <Element
                    icon={fileIcon}
                    name="Record_Book.docx"
                    retention="46d 5d 19h 5m"
                    time="5:19:05"
                ></Element>
            </div>
        </div>
    );
}

function Element(props) {
    return (
        <div className="el">
            <div className="fileType">
                <img src={props.icon} />
            </div>
            <div className="separator"></div>
            <div className="fileName">
                <div className="container">
                    <h4>{props.name}</h4>
                </div>
            </div>
            <div className="separator"></div>
            <div className="retentionSet">
                <div className="container">
                    <h4>{props.retention}</h4>
                </div>
            </div>
            <div className="separator"></div>
            <div className="timeRemain">
                <div className="container">
                    <h4>{props.time}</h4>
                </div>
            </div>
        </div>
    );
}

if (typeof window !== "undefined") {
    hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
    return await ssr(<App {...data} />);
}
