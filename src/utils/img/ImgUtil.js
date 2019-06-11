/**
 * @Description : 获取文件类型图片
 * @Author : cheng fei
 * @CreateDate 2019/6/4 16:46
 */

const img = {
    avi  :  require("@/assets/image/AVI.png"),
    bmp  :  require("@/assets/image/bmp.png"),
    doc  :  require("@/assets/image/DOC.png"),
    docx : require("@/assets/image/docx.png"),
    dv : require("@/assets/image/DV.png"),
    emf : require("@/assets/image/EMF .png"),
    gif : require("@/assets/image/gif.png"),
    jpg : require("@/assets/image/jpg.png"),
    midi : require("@/assets/image/midi.png"),
    mov : require("@/assets/image/MOV.png"),
    mp3 : require("@/assets/image/MP3.png"),
    mp4 : require("@/assets/image/mp4.png"),
    mpeg : require("@/assets/image/mpeg.png"),
    pdf : require("@/assets/image/pdf.png"),
    png : require("@/assets/image/png.png"),
    ppt : require("@/assets/image/ppt.png"),
    psd : require("@/assets/image/psd.png"),
    rar : require("@/assets/image/RAR.png"),
    rm : require("@/assets/image/rm.png"),
    rmvb : require("@/assets/image/RMVB.png"),
    swf : require("@/assets/image/swf.png"),
    txt : require("@/assets/image/TXT.png"),
    wave : require("@/assets/image/wave.png"),
    wma : require("@/assets/image/WMA.png"),
    wmv : require("@/assets/image/wmv.png"),
    xls : require("@/assets/image/xls.png"),
    zip : require("@/assets/image/zip.png"),
    file : require("@/assets/image/file.png")
};

export function getFileTypeImgUrl(fileExtension) {
    fileExtension = fileExtension.toUpperCase();
    if (fileExtension === "AVI") {
        return img.avi
    } else if (fileExtension === "BMP") {
        return img.bmp
    } else if (fileExtension === "DOC") {
        return img.doc
    } else if (fileExtension === "DOCX") {
        return img.docx
    } else if (fileExtension === "DV") {
        return img.dv
    } else if (fileExtension === "EMF") {
        return img.emf
    } else if (fileExtension === "GIF") {
        return img.gif
    } else if (fileExtension === "JPG") {
        return img.jpg
    } else if (fileExtension === "MIDI") {
        return img.midi
    } else if (fileExtension === "MOV") {
        return img.mov
    } else if (fileExtension === "MP3") {
        return img.mp3
    } else if (fileExtension === "MP4") {
        return img.mp4
    } else if (fileExtension === "MPEG") {
        return img.mpeg
    } else if (fileExtension === "PDF") {
        return img.pdf
    } else if (fileExtension === "PNG") {
        return img.png
    } else if (fileExtension === "PPT") {
        return img.ppt
    } else if (fileExtension === "PSD") {
        return img.psd
    } else if (fileExtension === "RAR") {
        return img.rar
    } else if (fileExtension === "RM") {
        return img.rm
    } else if (fileExtension === "RMVB") {
        return img.rmvb
    } else if (fileExtension === "SWF") {
        return img.swf
    } else if (fileExtension === "TXT") {
        return img.txt
    } else if (fileExtension === "WAVE") {
        return img.wave
    } else if (fileExtension === "WMA") {
        return img.wma
    } else if (fileExtension === "wmv") {
        return img.wmv
    } else if (fileExtension === "XLS") {
        return img.xls
    } else if (fileExtension === "ZIP") {
        return img.zip
    } else {
        return img.file
    }
}
