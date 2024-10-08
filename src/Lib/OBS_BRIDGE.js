import { getAttributeValue_fromMobel_ByGuid, getAttributeValue_fromMobel_ByTypeNumber, inArray, RGB, ID_DEFAULT_FONT, TextLine, ImageNew, emptyLine, curretDateOnRunTime, oOutput } from "../Core/ARIS_BEYOND_1.0.js";

/*
     | Data Binding
     |=-=-=-=-*/

export let currentGroups = ArisData.getSelectedGroups();
export let currentLocale = Context.getSelectedLanguage();
export let nLocale = Context.getSelectedLanguage();


/*
     | For UI Colors
     |=-=-=-=-*/

export const Super_big_title_font_size = 26 + 2;
export const big_title_font_size = 15 + 2;
export const title_font_size = 14 + 2;
export const sub_title_font_size = 12 + 2;
export const header_font_size = 12 + 2;
export const content_font_size = 10 + 2;

export let OBSBlue = [30, 155, 215];
export let OBSBlue2 = [23, 80, 126];
export let OBSBlueGreen = [48, 174, 152];
export let OBSBlueDarkBG = [15, 37, 71];
export let black = [0, 0, 0]; // #000000
export let white = [255, 255, 255]; // #ffffff
export let lightGray = [191, 191, 191];
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
              Model_name: single_task.model_name,
              Task_Name: single_task.task_name,
              Document_Name: single_task.doc_name
          })
      }
  }
  return results;
}
export function sectionPageSetup(outputObj, showFooter = true) {
  outputObj.SetAutoTOCNumbering(false);
  outputObj.SetTOCFormat(0, ID_DEFAULT_FONT, 10.5, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 0, 0, 0, 0);
  outputObj.SetTOCFormat(1, ID_DEFAULT_FONT, 11.5, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 5, 5, 2, 2);
  outputObj.SetTOCFormat(2, ID_DEFAULT_FONT, 10.5, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 10, 5, 2, 2);
  outputObj.SetTOCFormat(3, ID_DEFAULT_FONT, 9.5, Constants.C_BLACK, Constants.C_WHITE, Constants.FMT_LEFT, 15, 5, 2, 2);

  oOutput.setTopMargin(5);
  oOutput.setLeftMargin(10);
  oOutput.setRightMargin(10);
  createHeader(outputObj);

  if (showFooter) {
    createFooter(outputObj);
  }

  function createHeader(outputObj) {
    outputObj.BeginHeader();
    oOutput.BeginTable(100, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, Constants.FMT_RIGHT | Constants.FMT_NOBORDER, 0);
    oOutput.TableRow();
    oOutput.ResetFrameStyle();
    oOutput.TableCell("", 70, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_VCENTER | Constants.FMT_LEFT, 0);
    oOutput.OutGraphic(Context.createPicture("logo_gray.png"), -1, 80, 15);
    oOutput.TableCell("", 30, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_VCENTER | Constants.FMT_RIGHT, 0);
    TextLine("obs", 11.4, "center-bold", OBSBlue);
    emptyLine();
    oOutput.EndTable("", 100, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_RIGHT, 0);
    emptyLine();
    outputObj.EndHeader();
  }

  function createFooter(outputObj) {
    outputObj.BeginFooter();
    outputObj.BeginTable(100, RGB(white), Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outputObj.TableRow();
    oOutput.ResetFrameStyle();
    outputObj.TableCell("", 100, ID_DEFAULT_FONT, 10, Constants.C_WHITE, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    outputObj.Output(" الصفحة ", ID_DEFAULT_FONT, 11, RGB(black), Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outputObj.OutputField(Constants.FIELD_PAGE, ID_DEFAULT_FONT, 11, RGB(black), Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT);
    outputObj.Output(" من ", ID_DEFAULT_FONT, 11, RGB(black), Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
    outputObj.OutputField(Constants.FIELD_NUMPAGES, ID_DEFAULT_FONT, 11, RGB(black), Constants.C_TRANSPARENT, Constants.FMT_BOLD | Constants.FMT_LEFT);
    outputObj.EndTable("", 100, ID_DEFAULT_FONT, 10, Constants.C_WHITE, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);

    let A4_height = oOutput.GetPageHeight();
    let A4_width = oOutput.GetPageWidth();

    oOutput.OutGraphicAbsolute(Context.createPicture("footer_art.png"), 0, A4_height - 10, A4_width, 10, true);
    outputObj.EndFooter();
  }
}
export function newCustomeTitle(textAR, textEN) {
  oOutput.BeginTable(100, Constants.C_TRANSPARENT, Constants.C_TRANSPARENT, Constants.FMT_RIGHT | Constants.FMT_NOBORDER, 0);
  oOutput.TableRow();
  oOutput.ResetFrameStyle();
  oOutput.TableCell("", 50, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_VCENTER | Constants.FMT_RIGHT, 0);
  TextLine(textAR, 15, "left-bold", OBSBlue);
  oOutput.TableCell("", 50, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_VCENTER | Constants.FMT_LEFT, 0);
  TextLine(textEN, 15, "right-bold", OBSBlue);
  oOutput.EndTable("", 100, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_RIGHT, 0);
}
