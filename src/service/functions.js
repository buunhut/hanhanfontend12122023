import { useDispatch } from "react-redux";
import { tangSoLuong } from "../redux/gioHangSlice";

// export const URL = 'http://localhost:8080'
// export const URL = 'http://61.14.233.80:8080'
// export const URL = 'http://nodejs.edu.vn:8080'
export const URL = 'https://api.bachhoahanhan.com'




export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export const boDauTiengViet = (string) => {
    const accentMap = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    };

    return string.replace(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, (match) => accentMap[match]);
}

//đọc số thành chữ tiếng việt
export const numberToWords = (number) => {
    if (number === 0) {
        const result = 'không'
        return result
    } else {
        const count = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
        const units = ['ngàn', 'triệu', 'tỷ']
        const numString = number.toString()
        //gom các số theo cụm 3 ký tự
        const block3Digit = [];
        for (let i = numString.length; i > 0; i -= 3) {
            block3Digit.unshift(numString.substring(Math.max(0, i - 3), i));
        }
        const read3Digit = (num, i) => {
            let result = ''
            //tách trăm
            const tram = Math.floor(num / 100)
            //tách chục
            const chuc = Math.floor((num % 100) / 10)
            //tách đơn vị
            const donVi = num % 10
            if (tram > 0) {
                result += count[tram] + ' trăm '
            } else if (tram === 0) {
                if (i > 0 && donVi > 0) {
                    result += 'không trăm '
                }
            }
            if (chuc === 1) {
                result += 'mười '
            } else if (chuc > 1) {
                result += count[chuc] + ' mươi '
            }
            else if (chuc === 0) {
                if (i >= 0 && donVi > 0 && tram > 0) {
                    result += 'lẻ '
                }
            }
            if (donVi > 0) {
                if (donVi === 5 && chuc >= 1) {
                    result += 'lăm '
                } else {
                    if (chuc > 1 && donVi === 1) {
                        result += 'mốt '
                    } else {
                        result += count[donVi] + ' '
                    }
                }
            }
            return result
        }
        let result = ''
        if (block3Digit.length > 4) {
            // console.log('số quá lớn, chưa viết')
            let overResult = '';
            let overArray = []

            const over = (block3Digit.length - 4)
            for (let i = 0; i <= over; i++) {
                overArray.push(block3Digit[i])
            }


            for (let i = 0; i < overArray.length; i++) {
                if (units[overArray.length - (2 + i)]) {
                    if (+overArray[i] > 0) {
                        overResult += read3Digit(overArray[i], i) + '' + units[overArray.length - (2 + i)] + ' '
                    } else {
                        break
                    }
                } else {
                    overResult += read3Digit(overArray[i], i)
                }
            }

            overResult += 'tỷ '
            // console.log(overResult + 'tỷ ')
            for (let i = overArray.length; i < block3Digit.length; i++) {
                if (units[block3Digit.length - (2 + i)]) {
                    if (+block3Digit[i] > 0) {
                        overResult += read3Digit(block3Digit[i], i) + '' + units[block3Digit.length - (2 + i)] + ' '
                    } else {
                        break
                    }
                } else {
                    overResult += read3Digit(block3Digit[i], i)
                }
            }
            // console.log(overResult)
            return overResult
        } else {

            for (let i = 0; i < block3Digit.length; i++) {
                if (units[block3Digit.length - (2 + i)]) {
                    if (+block3Digit[i] > 0) {
                        result += read3Digit(block3Digit[i], i) + '' + units[block3Digit.length - (2 + i)] + ' '
                    } else {
                        break
                    }
                } else {
                    result += read3Digit(block3Digit[i], i)
                }
            }
        }
        return result
    }
}

