export function easyGrid(rows, col, callBackArray, algin, tableBackground, borderColor, cellBackground, cellVerticalAlgin) {
    var algin = !algin ? "left" : algin;
    if (algin == "left") {
      algin = Constants.FMT_LEFT;
    } else if (algin == "right") {
      algin = Constants.FMT_RIGHT;
    } else if (algin == "center") {
      algin = Constants.FMT_CENTER;
    }
    var tableBackground = !tableBackground ? Constants.C_TRANSPARENT : RGB(tableBackground);
    var borderColor = !borderColor ? Constants.C_TRANSPARENT : RGB(borderColor);
    var cellBackground = !cellBackground ? Constants.C_TRANSPARENT : RGB(cellBackground);
  
    oOutput.BeginTable(100, borderColor, tableBackground, algin, 0);
    for (var i = 0; i < rows; i++) {
      oOutput.TableRow();
      oOutput.ResetFrameStyle();
      for (var j = 0; j < col; j++) {
        var cellAlgin = Constants.FMT_LEFT;
        var cellSize = !callBackArray[i][j][2] ? 100 / col : callBackArray[i][j][2];
  
        if (callBackArray[i][j][1] == "left") {
          cellAlgin = Constants.FMT_LEFT;
        } else if (callBackArray[i][j][1] == "right") {
          cellAlgin = Constants.FMT_RIGHT;
        } else if (callBackArray[i][j][1] == "center") {
          cellAlgin = Constants.FMT_CENTER;
        } else if (callBackArray[i][j][1] == "middle-vertical-text") {
          cellAlgin = cellAlgin | Constants.FMT_VMIDDLE | Constants.FMT_VERT_UP | Constants.FMT_VCENTER | Constants.FMT_VERT_UP | Constants.FMT_CENTER;
        }
  
        if (callBackArray[i][j][2]?.toString()?.indexOf("custom-size-for-this-cell=") == 0) {
          let customSize = callBackArray[i][j][2]?.toString()?.split("=")[1];
          // convert customSize to number
          customSize = Number(customSize);
          cellSize = customSize;
        }
  
        // if callBackArray[i][j][3] esists then it is a function
        let customCellColor = null;
        if (callBackArray[i][j][3]) {
          customCellColor = callBackArray[i][j][3];
        }
  
        if (cellVerticalAlgin == "top") {
          cellAlgin = cellAlgin | Constants.FMT_VCENTER;
        } else if (cellVerticalAlgin == "bottom") {
          cellAlgin = cellAlgin | Constants.FMT_VBOTTOM;
        } else if (cellVerticalAlgin == "middle") {
          cellAlgin = cellAlgin | Constants.FMT_VMIDDLE;
        } else {
          cellAlgin = cellAlgin | Constants.FMT_VCENTER;
        }
  
        oOutput.TableCell("", cellSize, ID_DEFAULT_FONT, 10, Constants.C_BLACK, customCellColor == null ? tableBackground : RGB(customCellColor), 0, cellAlgin, 0);
        callBackArray[i][j][0]();
      }
    }
    oOutput.EndTable("", 100, ID_DEFAULT_FONT, 10, Constants.C_BLACK, tableBackground, 0, algin, 0);
  }




// This function is used to get the models and their tasks and documents and write to a word file


import { currentGroups, currentDB, currentLocale } from "./ARIS_BEYOND/ARIS_BEYOND";
import { oOutput, TextLine, emptyLine } from "../Core/ARIS_BEYOND_1.0.js";



export function get_models() {
    let current_models = currentGroups[0].ModelListFilter(Constants.MT_ENTERPRISE_BPMN_COLLABORATION);
    let results = [];
    for (let index = 0; index < current_models.length; index++) {
        let single_task = {}

        let model_name = current_models[index].Name(currentLocale)
        single_task.model_name = model_name;

        let current_tasks = current_models[index]?.ObjOccListBySymbol([Constants.ST_BPMN_USER_TASK, Constants.ST_BPMN_TASK]);
        for (let index = 0; index < current_tasks.length; index++) {
            let task = current_tasks[index]?.ObjDef();

            let task_name = task.Name(currentLocale)
            single_task.task_name = task_name;

            let task_relationships = task?.CxnListFilter(Constants.EDGES_IN, [Constants.CT_IS_NEEDED_BY])
            let doc_name = task_relationships[0]?.SourceObjDef().Name(currentLocale)
            single_task.doc_name = doc_name;

            results.push({
                "Model_name": single_task.model_name,
                "Task_Name": single_task.task_name,
                "Document_Name": single_task.doc_name
            })
        }
    }
    return results;
}

export function writeToWordFile(data) {
    sectionPageSetup(oOutput);
    
    newCustomeTitle("Relation type", "Model Results");
    emptyLine();

    oOutput.BeginTable(100, Constants.C_TRANSPARENT, Constants.C_BLACK, Constants.FMT_LEFT, 0);
    oOutput.TableRow();
    oOutput.TableCell("Model Name", 33, ID_DEFAULT_FONT, 12, Constants.C_BLACK, OBSBlue, 0, Constants.FMT_BOLD | Constants.FMT_CENTER, 0);
    oOutput.TableCell("Task Name", 33, ID_DEFAULT_FONT, 12, Constants.C_BLACK, OBSBlue, 0, Constants.FMT_BOLD | Constants.FMT_CENTER, 0);
    oOutput.TableCell("Document Name", 34, ID_DEFAULT_FONT, 12, Constants.C_BLACK, OBSBlue, 0, Constants.FMT_BOLD | Constants.FMT_CENTER, 0);

    for (let i = 0; i < data.length; i++) {
        oOutput.TableRow();
        oOutput.TableCell(data[i].Model_name, 33, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
        oOutput.TableCell(data[i].Task_Name, 33, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
        oOutput.TableCell(data[i].Document_Name, 34, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    }

    oOutput.EndTable("", 100, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
}

// Usage
let modelData = get_models();
writeToWordFile(modelData);