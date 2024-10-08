//Library imports
import { oOutput} from "../Core/ARIS_BEYOND_1.0.js";
import { PAGE_NEW, PAGE_END, emptyLine, ImageNew,  ID_DEFAULT_FONT,RGB } from "../Core/ARIS_BEYOND_1.0.js";
import { sectionPageSetup } from "../Lib/OBS_BRIDGE.js";
//Data imports
import { get_models } from "../Lib/OBS_BRIDGE.js";
//UI Colors imports
import { OBSBlue } from "../Lib/OBS_BRIDGE.js";

//import {TextLine, emptyLine } from "../Core/ARIS_BEYOND_1.0.js";
export function Page_1() {
  PAGE_NEW(oOutput);
  oOutput.setTopMargin(2);
  oOutput.setLeftMargin(0);
  
  
  
  
  
  
  function writeToWordFile(data) {
      sectionPageSetup(oOutput);
      
      //newCustomeTitle("Relation type", "Model Results");
      emptyLine();
  
      oOutput.BeginTable(100, Constants.C_TRANSPARENT, Constants.C_BLACK, Constants.FMT_LEFT, 0);
      oOutput.TableRow();
      oOutput.TableCell("Model Name", 33, ID_DEFAULT_FONT, 12, Constants.C_BLACK, RGB(OBSBlue), 0, Constants.FMT_BOLD | Constants.FMT_CENTER, 0);
      oOutput.TableCell("Task Name", 33, ID_DEFAULT_FONT, 12, Constants.C_BLACK, RGB(OBSBlue), 0, Constants.FMT_BOLD | Constants.FMT_CENTER, 0);
      oOutput.TableCell("Document Name", 34, ID_DEFAULT_FONT, 12, Constants.C_BLACK, RGB(OBSBlue), 0, Constants.FMT_BOLD | Constants.FMT_CENTER, 0);
  
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
  emptyLine();
  emptyLine();
  emptyLine();

  emptyLine();
  emptyLine();
  emptyLine();
  emptyLine();

  PAGE_END(oOutput);
}

let art_imaage = () => {
  ImageNew("art_page1.png", 200, 250, "left");
};
