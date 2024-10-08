/*
  | System Vars
  |=-=-=-=-*/

const DEBUG = false;
export const LANG = "AR";

export let currentDB = ArisData.getActiveDatabase();
export let currentLocale = Context.getSelectedLanguage(); // Context.getSelectedLanguage();
export let currentSelectedFormat = Context.getSelectedFormat();
export let currentFirstObject = ArisData.getSelectedObjDefs()[0];
export let current_main_group = currentDB.RootGroup();
export let oOutput = Context.createOutputObject();

export let ID_DEFAULT_FONT = "Somar Medium";

/*-**-**-**-**-**-*
     For Data Obtain ...
      *-**-**-**-**-**-*/
let defaultValue = "N/A";
export function getAttributeValue_fromMobel_ByGuid(guid, modelObj, currentLocale) {
  //

  let value = modelObj?.Attribute(ArisData?.ActiveFilter()?.UserDefinedAttributeTypeNum(guid), currentLocale).getValue()?.toString();
  // convert valeu to string and remove all spaces
  let rawValue = value?.split(" ")?.join("");
  if (value === undefined || value === null || value === "" || rawValue.length < 1) {
    return defaultValue;
  } else {
    return value;
  }
}
export function getAttributeValue_fromMobel_ByTypeNumber(TypeNumber, modelObj, currentLocale) {
  let value = modelObj?.Attribute(TypeNumber, currentLocale)?.getValue()?.toString();
  let rawValue = value?.split(" ")?.join("");

  if (value === undefined || value === null || value === "" || rawValue.length <= 2) {
    return defaultValue;
  } else {
    return value;
  }
}

/*-**-**-**-**-**-*
  For Time & Date 😅 ...
   *-**-**-**-**-**-*/

export function curretDateOnRunTime() {
  var today = new Date();
  var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time = today.getHours() + "-" + today.getMinutes() + "";
  return date;
}
export function curretDateAndTimeOnRunTime() {
  var today = new Date();
  var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + "";
  return date + " " + time;
}

/*-**-**-**-**-**-*
  For Logging 😅 ...
   *-**-**-**-**-**-*/

export function log(msg) {
  Dialogs.MsgBox("" + msg + "");
}

/*-**-**-**-**-**-*
  For JS ES5 😅 ...
   *-**-**-**-**-**-*/
// all types use this
export function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
// string use this
export function inArray(target, array) {
  /* Caching array.length doesn't increase the performance of the for loop on V8 (and probably on most of other major engines) */

  for (var i = 0; i < array.length; i++) {
    if (array[i] === target) {
      return true;
    }
  }

  return false;
}
/*-**-**-**-**-**-*
  For UI helping 😅 ...
   *-**-**-**-**-**-*/

export function runReport(oOutput) {
  oOutput.WriteReport();
}
export function RGB(color) {
  var r = color[0];
  var g = color[1];
  var b = color[2];

  return new java.awt.Color(r / 255.0, g / 255.0, b / 255.0, 1).getRGB() & 0xffffff;
}

export function wordSetup() {}

export function emptyLine(outputObj) {
  oOutput.OutputLn("  ", ID_DEFAULT_FONT, 12, RGB(0, 0, 0), Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0);
}

/*
  | UI - Multi components Helpers
  |=-=-=-=-*/
export function TextLine(text, size, algin, Color, TOC_LEVEL, highlightColor, no_newLine) {
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

export function Box_withBorder(title, text, titleColor, textColor, borderColor, size, algin, titleSize, textAlign) {
  var titleColor = !titleColor ? [0, 0, 0] : titleColor;
  var textColor = !textColor ? [0, 0, 0] : textColor;
  var borderColor = !borderColor ? [0, 0, 0] : borderColor;
  var textAlign = !textAlign ? "justify" : textAlign;
  var size = !size ? 100 : size;
  var titleSize = !titleSize ? 28 : titleSize;
  var algin = !algin ? "left" : algin;
  if (algin == "left") {
    algin = Constants.FMT_LEFT;
  } else if (algin == "right") {
    algin = Constants.FMT_RIGHT;
  } else if (algin == "center") {
    algin = Constants.FMT_CENTER;
  }

  oOutput.BeginTable(size, RGB(borderColor), Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
  oOutput.TableRow();
  oOutput.ResetFrameStyle();
  oOutput.TableCell("", size, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_VCENTER | Constants.FMT_CENTER, 0);
  TextLine(title, titleSize, "left-bold", titleColor);
  emptyLine();
  TextLine(text, 14, textAlign, textColor);

  emptyLine();
  oOutput.EndTable("", size, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);
}
export function Box_withBorder_AR(title, text, titleColor, textColor, borderColor, size, algin, titleSize, textAlign) {
  var titleColor = !titleColor ? [0, 0, 0] : titleColor;
  var textColor = !textColor ? [0, 0, 0] : textColor;
  var borderColor = !borderColor ? [0, 0, 0] : borderColor;
  var textAlign = !textAlign ? "right" : textAlign;
  var size = !size ? 100 : size;
  var titleSize = !titleSize ? 28 : titleSize;
  var algin = !algin ? "right" : algin;
  if (algin == "left") {
    algin = Constants.FMT_LEFT;
  } else if (algin == "right") {
    algin = Constants.FMT_RIGHT;
  } else if (algin == "center") {
    algin = Constants.FMT_CENTER;
  }

  oOutput.BeginTable(size, RGB(borderColor), Constants.C_TRANSPARENT, Constants.FMT_CENTER, 0);
  oOutput.TableRow();
  oOutput.ResetFrameStyle();
  oOutput.TableCell("", size, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_VCENTER | Constants.FMT_CENTER, 0);
  TextLine(title, titleSize, "right-bold", titleColor);
  emptyLine();
  TextLine(text, 14, textAlign, textColor);

  emptyLine();
  oOutput.EndTable("", size, ID_DEFAULT_FONT, 10, Constants.C_BLACK, Constants.C_TRANSPARENT, 0, Constants.FMT_CENTER, 0);
}

/*
  | UI - Image Helpers
  |=-=-=-=-*/
export function ImageNew(filename, Width, Height, algin = "center") {
  if (algin == "left") {
    algin = Constants.FMT_LEFT;
  } else if (algin == "right") {
    algin = Constants.FMT_RIGHT;
  } else if (algin == "center") {
    algin = Constants.FMT_CENTER;
  }
  oOutput.BeginParagraph(algin, 0, 0, 0, 0, 0);
  var image = Context.createPicture(filename);
  oOutput.OutGraphic(image, -1, Width, Height);
  oOutput.EndParagraph();
}

/*
  | UI - Table / grids Helpers
  |=-=-=-=-*/

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

/*
  | UI - Page Helpers
  |=-=-=-=-*/
export function PAGE_BREAK(oOutput) {
  oOutput.OutputField(Constants.FIELD_NEWPAGE, ID_DEFAULT_FONT, 11, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT);
}
export function PAGE_NEW(oOutput, landscape = false) {
  if (landscape) {
    oOutput.setPageWidth(297);
    oOutput.setPageHeight(210);
  } else {
    oOutput.setPageWidth(210);
    oOutput.setPageHeight(297);
  }

  oOutput.BeginSection(false, Constants.SECTION_INDEX);
}
export function PAGE_END(oOutput) {
  ArisData.getActiveDatabase().clearCaches();
  oOutput.EndSection();
}
