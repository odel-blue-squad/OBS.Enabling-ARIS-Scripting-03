(function () {
  'use strict';

  var currentDB = ArisData.getActiveDatabase();
  Context.getSelectedLanguage(); // Context.getSelectedLanguage();
  Context.getSelectedFormat();
  ArisData.getSelectedObjDefs()[0];
  currentDB.RootGroup();
  var oOutput = Context.createOutputObject();
  var ID_DEFAULT_FONT = "Somar Medium";
  /*-**-**-**-**-**-*
    For UI helping 😅 ...
     *-**-**-**-**-**-*/

  function runReport(oOutput) {
    oOutput.WriteReport();
  }
  function RGB(color) {
    var r = color[0];
    var g = color[1];
    var b = color[2];
    return new java.awt.Color(r / 255.0, g / 255.0, b / 255.0, 1).getRGB() & 0xffffff;
  }
  function emptyLine(outputObj) {
    oOutput.OutputLn("  ", ID_DEFAULT_FONT, 12, RGB(0), Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
  }

  /*
    | UI - Multi components Helpers
    |=-=-=-=-*/
  function TextLine(text, size, algin, Color, TOC_LEVEL, highlightColor, no_newLine) {
    var FMT;
    var size = !size ? 10 : size;
    var algin = !algin ? "left" : algin;
    var Color = !Color ? [0, 0, 0] : Color;
    var highlightColor = !highlightColor ? Constants.C_TRANSPARENT : highlightColor;
    var TOC_LEVEL = !TOC_LEVEL ? null : TOC_LEVEL;
    var checkFMT = algin.split("-");
    for (var i = 0; i < checkFMT.length; i++) {
      var element = checkFMT[i];
      if (element == "center") {
        FMT = Constants.FMT_CENTER;
      }
      if (element == "left") {
        FMT = Constants.FMT_LEFT;
      }
      if (element == "right") {
        FMT = Constants.FMT_RIGHT;
      }
      if (element == "justify") {
        FMT = Constants.FMT_JUSTIFY;
      }
      if (element == "bold") {
        FMT = FMT | Constants.FMT_BOLD;
      }
      if (element == "italic") {
        FMT = FMT | Constants.FMT_ITALIC;
      }
    }
    if (TOC_LEVEL != null) {
      switch (TOC_LEVEL) {
        case "main-title":
          FMT = FMT | Constants.FMT_TOCENTRY0;
          break;
        case "sub-title":
          FMT = FMT | Constants.FMT_TOCENTRY1;
          break;
        case "sub-sub-title":
          FMT = FMT | Constants.FMT_TOCENTRY2;
          break;
        case "sub-sub-sub-title":
          FMT = FMT | Constants.FMT_TOCENTRY3;
          break;
      }
    }
    if (no_newLine === true) {
      oOutput.Output(text, ID_DEFAULT_FONT, size, RGB(Color), highlightColor, FMT, 0.71);
    } else {
      oOutput.OutputLn(text, ID_DEFAULT_FONT, size, RGB(Color), highlightColor, FMT, 0.71);
    }
  }
  function PAGE_NEW(oOutput) {
    var landscape = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (landscape) {
      oOutput.setPageWidth(297);
      oOutput.setPageHeight(210);
    } else {
      oOutput.setPageWidth(210);
      oOutput.setPageHeight(297);
    }
    oOutput.BeginSection(false, Constants.SECTION_INDEX);
  }
  function PAGE_END(oOutput) {
    ArisData.getActiveDatabase().clearCaches();
    oOutput.EndSection();
  }

  /*
       | Data Binding
       |=-=-=-=-*/

  var currentGroups = ArisData.getSelectedGroups();
  var currentLocale = Context.getSelectedLanguage();
  Context.getSelectedLanguage();
  var OBSBlue = [30, 155, 215];
  var black = [0, 0, 0]; // #000000
  var white = [255, 255, 255]; // #ffffff
  function get_models() {
    var current_models = currentGroups[0].ModelListFilter(Constants.MT_ENTERPRISE_BPMN_COLLABORATION);
    var results = [];
    for (var index = 0; index < current_models.length; index++) {
      var _current_models$index;
      var single_task = {};
      var model_name = current_models[index].Name(currentLocale);
      single_task.model_name = model_name;
      var current_tasks = (_current_models$index = current_models[index]) === null || _current_models$index === void 0 ? void 0 : _current_models$index.ObjOccListBySymbol([Constants.ST_BPMN_USER_TASK, Constants.ST_BPMN_TASK]);
      for (var _index = 0; _index < current_tasks.length; _index++) {
        var _current_tasks$_index, _task_relationships$;
        var task = (_current_tasks$_index = current_tasks[_index]) === null || _current_tasks$_index === void 0 ? void 0 : _current_tasks$_index.ObjDef();
        var task_name = task.Name(currentLocale);
        single_task.task_name = task_name;
        var task_relationships = task === null || task === void 0 ? void 0 : task.CxnListFilter(Constants.EDGES_IN, [Constants.CT_IS_NEEDED_BY]);
        var doc_name = (_task_relationships$ = task_relationships[0]) === null || _task_relationships$ === void 0 ? void 0 : _task_relationships$.SourceObjDef().Name(currentLocale);
        single_task.doc_name = doc_name;
        results.push({
          Model_name: single_task.model_name,
          Task_Name: single_task.task_name,
          Document_Name: single_task.doc_name
        });
      }
    }
    return results;
  }
  function sectionPageSetup(outputObj) {
    var showFooter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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
      var A4_height = oOutput.GetPageHeight();
      var A4_width = oOutput.GetPageWidth();
      oOutput.OutGraphicAbsolute(Context.createPicture("footer_art.png"), 0, A4_height - 10, A4_width, 10, true);
      outputObj.EndFooter();
    }
  }

  //Library imports

  //import {TextLine, emptyLine } from "../Core/ARIS_BEYOND_1.0.js";
  function Page_1() {
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
      for (var i = 0; i < data.length; i++) {
        oOutput.TableRow();
        oOutput.TableCell(data[i].Model_name, 33, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
        oOutput.TableCell(data[i].Task_Name, 33, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
        oOutput.TableCell(data[i].Document_Name, 34, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
      }
      oOutput.EndTable("", 100, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_LEFT, 0);
    }

    // Usage
    var modelData = get_models();
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

  /*
              Java script Rerpot
   -=--=--=--=--=--=--=--=--=--=--=--=--=--=-
   |        This is Prod Report
   |     // OBS Process Manual Report
   |-=--=--=--=--=--=--=--=--=--=--=--=--=--=-
   |--------------
   | Export Format : Word Docx / PDF
   ---------------
   | Coded By : Rakan Omar (KSA OBS)
   | ARIS Beyond Build By : Rakan Omar (KSA OBS)
   | Version : 1.0.0 (03/12/2023)
   ______________
   */
  //import { Page_2 } from "./Pages/Page_2.js";
  //import { Page_3 } from "./Pages/Page_3.js";

  Context.setProperty("use-new-output", true);
  var LANG_AR = 1025;
  var Filter = currentDB.ActiveFilter();
  Filter.setMethodLocale(LANG_AR);
  oOutput.setLocale(LANG_AR);
  main();
  function main() {
    // custom sorting
    Page_1();
    runReport(oOutput);
  }

})();
