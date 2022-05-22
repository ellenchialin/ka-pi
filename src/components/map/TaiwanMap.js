import PropTypes from 'prop-types'
import { Box } from '@chakra-ui/react'

import { cityData } from '../../cityData'
import './TaiwanMap.css'

function TaiwanMap({
  setClickedCity,
  setCityChineseName,
  setCityCafes,
  setTaipeiCafes,
  setNewTaipeiCafes,
  getCafes,
}) {
  const convertCityNameToChinese = (name, callback) => {
    const cityChName = cityData.find(city => city.tag === name).place
    callback(cityChName)
  }

  const showCityInfo = selectedCity => {
    convertCityNameToChinese(selectedCity, setCityChineseName)
    setClickedCity(selectedCity)

    if (selectedCity === 'new_taipei') {
      getCafes('new_taipei', 'taipei', setNewTaipeiCafes)
      return
    }
    if (selectedCity === 'taipei') {
      getCafes('taipei', 'taipei', setTaipeiCafes)
      return
    }
    getCafes(selectedCity, selectedCity, setCityCafes)
  }

  return (
    <Box w="100%" maxW="450px">
      <svg
        id="cf503461-00bd-459a-aeb5-062ebc913211"
        data-name="圖層 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 595.28 841.89"
        className="taiwanMap"
      >
        <defs></defs>
        <title>台灣地圖</title>
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="3bb77815-2bc3-4801-b8fc-d6e3a2443162"
          data-name="penghu"
          d="M77.44,422.09l-2,1.71-.79.24h-.92l.43.79v.92l-.18.85-1.22,1-.12.92.67.37,1.65-.73.67-.49,1,.06.61.43.55.61-1.83,2-.92.12-1.83-.31,1,1.16,1.4.61,1.1-.12.79-.49,2.74.06.55.73.3.79-.91,1.46-.12.49.79.55-.06.67-.73.73-.79-.06-.55-.49L78,436.3l-.91.12L76,438.74l-1,1.1.43.73,1.77.18,1-.12,1.22-.43,1-.06,1.1,1.22.79-.18.12-.79.73-.67.06-.85.3-.85-.73-.43-.12-.67.61-.67.43-.79,3-2.38.79-.12L89,431.06l.24-.73.67-.55,4.21-.12,1.28-.61.55.43.18.91.43.79.73.49.85-.18.67-.37h1l.37-.55L98,428.31l-.55-2,.24-.73v-.91l-.37-.79-1.64-1.77-.43-1.4-.49.55-.24,1.71-.85-.12-.43-.85-.55-.61.24-.55.49-.37-1.16-1.1-.79-.31-.55.55-1.16,2.13-.67-.12-.61.18-1,1-.18.73-.49.12-.06-2.74.67-1.46-1,.12-.55.37-3.54.61-.55.43.06.85.49.67v.91l-.37.61-.85.24-.55.67v1.89l-.49.55-.91-.43-.67-.61.12-1.22-1-.12-.12-.85.49-.79.06-.55-.61-.73h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="2b6aac2d-ce2d-4c48-89d5-ff2a81000e07"
          data-name="chiayi"
          d="M193.2,485l-.14-1.13-1.11-.43h-2.58l-.28-1,.11-3.46,2-4.74,1,.09,2.5-1,.87-3.44.68-1.13-.17-2.41-.43-.6-1,.85-.85-.68-.53-1-.09-1.28.7-2.16v-1.13l-1-.26.09-1.2,1.47-2.86h-1.13l-1.11-.6L192,454l.51-1v-1.39l.6-.77.34-1.22.53-.94v-1.3l-1-.43-3.88.26-1.2-.43-.6-1,.26-6.21,1.07-.6,2.63.09,4,1.55h2.59l1,1.55h2.59l1.9-.86,4.31,1.55,2.59.34,1.55-1.21,1.21-1.55.17-2.41-.52-2.07,1.38-1.38h2.24v2.24l2.41.86.69-1.9,3.28-1.9.52-2.41,1.21-1.38,4.31-1.72,1.9,1,1.21-4.14,1-1.72,2.76.17,1.72-.86.69-2.07,4-1.21.69-1.9,1.55-1.21,1.21-1.55,1.9.86,1.55,1.21,1.9.69,4-1.55h5.17l3.62-1.9L267,415l1,3.45,2.93,2.41,1,1.55,1.72,1,2.41.17,1.55,1.21,2.07.69,9.49,1,1.9-1,1.21-1.38,3.79.17-.34,2.59,1.38,2.24,1.38-1.38,2.24-.52,1.38,1.38,2.07-.17,1.9-.69,2.41.17,1.9,1,2.41.34.86-1.72v-2.41l-.52-2.07-1-1.55,1.12-1.64,4.4-.43,7.93,2.93h2.59l2.24.52.86,1.72.17,5.86-.52,2.24-1.9,1.55v2.59l1,1.72,1.55,1.38.34,5,1.72,4,1.38,1.55,7.76.86,3.79-1.55,7.59.69,1.9.69,5.83.15-.83.19-1.72.86-4.48.69-1.55,1-4.31.86-2.93,2.41-1,1.72-1.9.86-1.55,1.21-2.24.35-1.55,1.72-1.21,2.93-1.21,1-.69,1.9-1.21,1.38-.17,2.41-1.9.69h-2.59L327.51,475l-1,1.72-2.76,2.76-4.83.34-1.55,4-3.45,1.72-.69,1.9-4.48.34-.86,4.48-5.52-.17-1.55-1.38-5.35-.17-.86,7.93.86,1.9,1.38,1.72v2.59l-1.38,1.21-1.72-.86-4.31.86-2.07-.69-2.41-1.72-2.59,3.8-2.07.52-2.24-.17-2.93-2.07-4.14-1.21-.69-1.72,2.24-3.28-.52-1.72-1.38-2.24-.35-1.72.86-1.72-.69-1.9-.17-2.41,1-1.9,1.55-1.21.17-2.07-.69-1.9-2.41-.17-2.59-.86-.69-1.55,1.72-1.21-.17-2.24-5.35-.34v-2.24l1.72-1.21,1-1.55L264.21,468l-1.55.86-2.07-.52-1.72-1.38-2.24-.69-1.21-1.55-2.59-.69-.17.34-1.55,1-2.24.17-1.38-1.38-2.24.35-3.62,1.72h-5.17l-4.14,2.41-.17.17-1,1.72-4.31-.17.17,2.07-4.83.34-.34,2.24-.86,1.72-1.21,1-1.72-1-1.38,1.38.69,1.9-.34,1.21-6.55,3.28-.52,2.07-2.24,3.28-2.07.86-3.1-.86-.86-1.38v1.89l-1.72-.17-1.55-1.38-.69-2.07-2.59-.52L193.2,485h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="30e45b59-571b-4340-a006-0ba62460619a"
          data-name="taichung"
          d="M292.48,234.65l-1.2.3-.17,1.56-6.21,8.62-1.3,3.18.17,2.6-.09.34-.85,1.11-.36,1-1.88.85-.7,1.2-3.18,2.16.09.94.34.79.09,1.45-.6.7-1.64-.53,1.9.87.34.85-.68,1-.62.51-1.54-2-.62.34-.77.85-1.47.79.09,1.2-.51.87-1.9,1.11-.6,1,2.84,3.88-.09,1.11-.6.87-.26,1-.7-1.3.11-1.11-1,1.11-1-.09-.26-1.28.6-1.22-.09-1.2-.85.85-1.54,4.4,1.11.87.43.94.43.34.09-.17,1.2.77v1.3l-.43,1-2.65,3.86-.79.62-1,2.58.06,1.39,3,1.34,1.47,2.33.23,1.58.73,1.84.26,1.84,2.18,2.3-.85,1.11-.11,1.71.85,1.09,1.22.85h.36l1,1.58,1.34.62,1.09.85,1.47.36,1.32.73,7,1.6h1.71l1.11.85.23.6v3.67l1.09,1.45,1.22,1v1.94l-.6,1.34,1,4.76,1.71.13,1.09,1,2.43-.26.75-.49,3.88,3.31,6.1,2.2,1.47-.38h3.65l1.71.38,1.22,1.09,1.47-.13,2.92-1,4.4-4.74,2.56-6.72,2.2-2.2,3-.85.85-1.09-.23-4.5,2.56-5.12,1.11-.75,1.58.49.73,1.11,3.18.6,1.09,1v3.65l.73.38.49-1.11,1-.85.62-1.22.73-2.92,1.09,1,.26.36,1.94,1,1.71.26,1.71-.36,4.14-3.54,1.6-.23,1,.85,1.6.36,3.52-.13,1.22-.73L369,304.1l1.34-4.27,1-1,1.71-.36,2.92.36,1.09-.73h2.82l2.67-1.34.85-1.34,1.34-.85.85-1.09,1.22-.73.85-1.34.38-1.47,1.22-.6,7.19-.13,1-.85.85-1.34.47-1.34,1.71-.13.85-1.09,1.11-.73,1.34.6.85,1,2.92.85.6-1.22,1.24-.73h1.81L414,283l1.09.75,1.71.6,1.34-.49.85-1.45.36-1.47,1.58-2.56h.62l2.2,1.6.73,1.09,3.18.73h1.81l.75-1.09,3.29.36.85.85,4.4,1.22,1.22-1,.6-1.22-.11-1.71,2.56-1.09.73-1.11,1.84.13,1-.85.38-1.58-.62-3.18.85-1.34,1.58-.6,1.11-.73L451,266l1-1.09h1.81l1.22-.85,1-1.22,1.47-2.95.49-5,.6-1.34,1.58-.85.85-1-.85-1.45-1.09-.73-.73-1.22-1.47-.75-4.87.62-1.24.62-1.58.23-1.09.85-.85,1.09-1.84.26-1.22-.62-2.82-4.76h-3.29l-1.34-.49L435,243.62l.6-4.89-.36-1.45-.62-1.24-.85-1-.26-.15-1.17.62-.45.94L431,237l-4-.09-.85.45-4.46-.17,0,.55-1.22.62-1.34,1.09-1,1.24L418,242.4l-2.3,3.78V248l-1.47.38h-1.84l-1.22-1.71.62-1-1.84-.73-1.34.6L408.1,247l-.85,1.22-1.58.49-3.29,4.63-1.34.49h-3.65l-1.24.85-.47,1.34-.49.11-1.34,1.47-.26,1.71-1.45.36-2.33,1.94-1.45.38-3.41-.38-3.05,1.11-3.67,4.63-1.81.13-1.34-.75-2.2-2.07-.26-1.71-1.22-.85-1.81-2.67-1.11.23h-1.84l-1.32-.62-3.41-.23-4.16-1.47-3.29-.11-1.47.6-1,1v1.84l.6,1.34.26,3.41-.62,1.32-1.22,1-1.47.49L342.5,268l-1.34.6h-3.65L334,267.52l-2.2-2.07L331,264.1l-1.11-.85-7.68-1.47-2.3-1.94-1.71-.49-1-1.34-2.43-1.34-1-1.09-1.45-.49-.85-1.09-.62-.26-2.07-.23-.85-1.22-2.2-1.47-5.12-6.59h-.23l-.62-1.22-3.05-1.22-1.58-2.56-.26-1.34Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="21535635-db1e-4831-a63f-263ab3ed4b79"
          data-name="keelung"
          d="M532.38,80.68l.05-.79-.73-.77L532,76.8l-1.22.09-1.62,1-1.47-1.37-1.3-.11-.6-.43V74.56l-1.11-.28-.53,1-1,.26-.26-1H522l.34,1,1,1.39-1.22,1.54-1.9,1.39-.85.09,1.56-1.47-.53-.94V75.33l-1-.09-.94-.51-1.22-.17-1.39-1.39h-2.67l-.77-.51.18-.93-.29-.61L511,71.9l-1.34.49-.73,1.1-1.58.37-.85,1.1-2.8,1.22-1.71.12-1.34.49-1.22.85-3.29.37v1.83l.73,1.34,1.59.49,1,1.1.12,1.71,2.07,4.63,1.59,1.1,1.1,1.46,1.59.37,1-.85v1.34l1.1,1.22L512.75,95l3.66,3.17,3.54.24,3.17-1.58,1.71-.12.73-1.22L526,94l-3.17-3V87.63l-.37-1.46,1.59-.37,2-2.07,1.71.37L529,85l.61.12,1.22-1.95,1-1,.61-1.46h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="21c4ba33-d057-42c1-9c71-be6061fc73cf"
          data-name="pingtung"
          d="M346.82,725.08l-2.07.69L343.37,727l-2.24.86-1.9-3.28-2.07-.52h-2.76l-.86-1.9-1.9-.69-1.55-1-2.93.17-.34-1.55.52-2.24,1.21-.69-1.9-.69L326,713.7l-3.28-1.9,1.21-1.55,1.72-.86-.17-5.17-1.72-1-.86-1.72H321l-2.59-2.76L316,697.49l3.28-10,4.48-.69.86-1.9-.52-2.24-1.9-1.38-1.72-3.62-2.76-1.72-.17-2.07-.69-2.07,2.93-2.24V667L317,661.45l-.35-2.93-1.21-.69-.69-2.07.34-2.41,1.9-3.45-.86-1.9,1-1.55.69-1.9-.17-2.41.69-1.72,1.38-1.38.52-2.07,1.21-1.38.17-.69,2.76-3.8.17-2.41,1.21-1.55.17-1.72,2.24.34,2.41-1.21,4.14-.86,2.07-4.31,7.59-.35,1.38-1.55.17-2.41,1.21-1.38.34-6.73,1.38-1.38-.69-1.55v-2.59l-.69-2.24-1.72-.86-2.24-.17-1.9-1.72-.52-1-.69-5.69L337.86,588l-1.55.52-.17-.86-1.72-.86-.69-.17h-2.24l-1,1.55L327,589.87l-1.21,1.55-1.9,1-1.9-1-4.31-5.17-5.86-3.62h-2.59l-2.07.52-2.24,3.28-2.07.52-.69.69h-1.9l-1.9-.86v-2.59l-1.21-1.38-2.07-.86-2.07.52-1.9,1.38-2.41.17-4.48,3.1-.86.34-2.76,2.24-.17.86-1.72,2.24L277.16,594l-2.41.17-4.14-1-1.9.86h-2.59l-1-1.55-3.1-.17-1.21-.52-1.72.86-1,6.73-.86,1.72-.34,2.24-.86,1.9.17,10.35-.52.86.17,3.1-1.21,4.66-1.21,1.55L252,629.89l-.17,12.42,2.41,2.93-1.9,11.21-.86,1.9-1.68,1.51-.13,1.26-.51.77-.09,2.58-.34.87.51,1.2.09,6.21,2,.17,1.37,1.3-.09,1.22-.6.17,1.22,1.62,3.44,2.52.62.85.94.43.43.09-.11,0,.11.28,2.07.87.79.85,1,.7,2,.68.77.68,1,.51.68.62,1.13.51.77.68,6.55,3.54.77.94,1.13.36,7.41,5.93.62.87,1.37,3.69-.26.53,3.71,2.5,4,5,.34,1v3.26l1.22,2,.51,2.33-.09,1.22-.34,1,.09,1,2.75,2.33.6.85.87.7.51.85.68,2.41,2.24,2.33-.6,1.22v1.3l.26,1.2.79.85,1.11,3.37.09,3.8.68,2.24v1.3l.45.85.34,1.47.85.77.51.85.19,1.22.94.94.17,2.43.51.85-.09,1.3-.51.85-3.54,1,.17,1.13,1.22.26.34.87-.09.43.26,1.11.43.87-.43.85-.6.68-1.73,1-.17,1.11.68.79-2.58,2.41v2.5l1,.6V776l.85.77-.26,1,2.67,2.33.26.94.87.87.51.85.34,1.73-.6,2.07.09,4.06-.77,1.81.6.77,1.2.17.62,2.24.68,1.13,2.67.26,1-1.64.77-.6.17-1.13-.51-2.16.43-.94,1-.43,1.37-1.47.87-.43h1.28l.34.94,2.86,2,.34.09,1.56-.09,1.11.26.43.87,1,.26.94.6,1.3.43,1.3.09,2.58,2.6.09,1.2,1.28.43.62.53.43.85.09,1.2,1.81,1.73h1.28l.87-.6-.17-1.13-.7-.6-.26-1.11.09-1.22-.34-.94-3.35-5.1v-5l.34-1-.43-.94.34-2.07.68-.26.09-1.13,2.33-.34,1.13-.43.43-.85,1-.26.87-.7.34-1,.09-1.22.6-.68,1.22-.09.26-2.33,2.5-1.64.26-1L346.57,769l-.09-6.38-.79-1.13v-1.3l1.81-3.05.68-.73v-1l-1-.43-1.39-1.47-.43-1.11-.17-3.29.17-.47.6,0,.34-.43.49-.34.21-.49-.6-.94,0-2.5-.58-.87.17-.43.36-.38.21-.43.13-.51-.13-.53V739.4l-.21-.66-.28-.38,0-.77-.43-.56-.21-.58.13-1.11,1-.79.26-.43.13-.47,0-1.26-.17-.56v-.47L347,731l-.6-.7.51-2.24.68-.77.34-.94-.68-.79-.11-.62"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="1e48e0bb-8964-4121-b347-b900162cf771"
          data-name="taipei"
          d="M466.27,77.17,465.42,79l-.85.85-.24.49-.85,1v1.83l-1.22.73L462,85.47l.49,1.59,1.22.85,3.9.49,2.44,2.32,1,1.83.12,5.61-1.83,2.56-1.22,1.1-.61,1.34.37,3.54.73,1.46,1.46-.12,1.34-.73.85-1.22.85-.12,2,.85,1.1.85.49,1.34v1.83l.85,1.46,1.58,1.1,1.71.12.73,2.93,2.56,1.71,6.83.73,1.46-.61h2l.12-1.22-3.29-1.59-.24-1.71.12-1.46-.85-2.8v-1.58l.85-1.34,1.22-.73,3.41.24,1.1-.73,1.46-.37,4.63.24.37-1-1.1-.49-1.58.49L497.86,103l-3.29-2.44L494,99.25l.85-1.1-.24-1.34-1-1,.73-.85,1.59-3.29-.37-3.17L490.29,84l.37-1.59,1-1.1-.37-1.22-2-1.71-.73-1.1-.12-3.54-2-2V70l.49-1.34V66.81l-3.17.24-1.34-2.44-1-1.1-1.71,2.68-1.34.61-.61,1.34-2.56,1.46-.61,1.59-1.1.73-1.71.12-1.34.61-2.07,2.44-.61,1.59-1.59.48h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="66958373-17e2-4fab-8b83-b16e2d323782"
          data-name="new_taipei"
          d="M571.73,105.84l-1,.09-.77.7-.79-1.47-.94-.34-.6-.68-1-.23-1.24,0-.57.58-1.15.72-2.75-.26-3.37-2.75-.26-1V97.39l-.43-.51.94-.68-.17-.43-2.84-2.86L554,90.84l1-3.09,1-.7.26-1-.43-.85-.68-.62-.43-.6.51-.85.85-.53V81.28l-1.2-.09-1.13.26-.68.68-2.33.79h-1.3L545.41,82l-1,.43-1-.43-3-.09-2-.6-.94.51-.87.85h-1.11l-.7-.85.26-1.11.53-.87.43-.43h-1.3l-1.11.43h-1.24v.79l-.61,1.46-1,1-1.22,1.95-.61-.12-1.22-.85L526,83.73l-2,2.07-1.59.37.37,1.46v3.29L526,94l-.49,1.46-.73,1.22-1.71.12L520,98.36l-3.54-.24-3.66-3.17L508,93.73l-1.1-1.22V91.17l-1,.85-1.59-.37-1.1-1.46-1.59-1.1-2.07-4.63-.12-1.71-1-1.1-1.59-.49-.73-1.34V78l3.29-.37,1.22-.85,1.34-.49,1.71-.12,2.8-1.22.85-1.1,1.58-.37.73-1.1,1.34-.49,1-.76-2-1.43-1-.34-1.11-.77-.36-.87.45-1,2-1-.19-.51-.77-.68.68-.77,1-.53.85-.77-.26-.77-3.09,2.67-4.31.26-3.37-3.46-.17-.85.85-.87-.43-.85h-1.37l-1-.43L497,56.78l.36-2.58L497.14,53l-.45-.85-.77-.68-2.5-3.54-2.16-.68-1.22-1.56-.94-.51h-1.3l-.94-.62-.7-.77-.85-.51-.3-.06-.92.15-.68.77-.34,1h-4.14l-1.3-1.39-.77.51v1.3l-.77.51-3.46.51-.43-1.11-.43.43-.17,1.22-1,.77-2.33.6-.94.7-1.13.34-2.41,5.08-.43.09-2.52-.34-.85.68L460,56.27l-.68.77-.26,1-.87,1.73L458,61.09l-.6.87-.87.51L455.06,64l-.17,1.28L453.5,67.9l-1.3.36-.77-.09.17.77,2.33,2.16,1.3.09,2.41,1.13,1,1.79,1,.7.68.85,1.47,3,.17,5.16-.6.51-.17-1.11-.53-1.13L460.48,81l-1.37-1.81L459,78l-.45-1.2L457,75.24l-4-2.58h-1.3l-.77.68L450.58,75l-2.52,2.41-1.11.34L445,78.87l-1,.26L441.17,81l-3.52,1.11-.87.6-8.2.09-1.64,1.56-.65,1,1.24,1.7.85.24.85,1.1,3.41.37,6.34,3-.37,2.44L440,95.44l3.54.85h3.66l.85.61,1.22,1.46.37,1.59v.49l-.61,1.22.24,1.59.85,1,1.59,1.1-.61,1.1-1.34.85-1.34.49,1.46,1.1.12,1.46-1.1.73-1.46.49L446.05,114l-2,1.34-7.68-.24-1.22.61-.36,1.46.73,1.34-.37,3.41-1,1-.61,1.34.85,1.59,1.46.12,1.1.85-1.46,1-.85,1-.61,1.34.61,2.93,3,1.83,2.32,3.54-.85,1.1.24,1.46.12.12,1.71,1.1-1.1.85-3.17.61-.12,1.46,1.71.24,1.1-.85,1.1,1.1,1.22.73,2,.49,1.83-.12,1.34-.73,3.66-.24.85.49.24.61,1,1,.49,1.34,2,2,1.1.61,1.1,1.22.12,1.71.61,1.71,1.59.49v1.83l-1.1.73-.73,1.1-2.2,1.83-.73,1.34.24,1.59.61,1.22v.73l1.34,3.41,2.19,2.07L459.1,174l1.71.73.12,1.22,1.71.49,1,1.34,1.34,1,.37,3.41,1,.42,3.26.19,1.59-1,3.17-.49,3.54-2.32.37-1.71,4-2.19,1.83-.12,1.46-.49.73-1.1,1.1-.85,1.58-.24,1-2.93v-1.83l-.49-1.46-1-1-.24-1.71,1.34-1.1.24-1.59-.12-1.71.61-1.34,1.46-.37,1.22-.73,1.71.49,1.59-1.22.37-1.46-1-.85,7.19-.85,2.44-1.22,1.1,1.22.49-1.34,1.46-.49.73-1.22,1.22-1.1.37-1.16,3.29-1.77,1.83-2.19,1.34-.73,1.59-.24,5.12.73,1.22-.61,1.71-.37-.12-.85.12-1.46,1-1.22.12-1.46-.37-1.58,1.71-2.2,2.07-1.71,1.58-.24,3.66.24,4-2.68,1-2.93-2.8-4,.61-1.22.37-1.46,1.22-1,3.54.24,1.59.61h2l1-1.1,4.63-3.29,3.66-.24,4.27-1.58,1.71-.12,2.53.47h0l.76-.34.53-1,1.2-.08.51-.77,1.9-.87.53-.9,1.28-.12.47-1,0-1Zm-68.86-.62-4.63-.24-1.46.37-1.1.73-3.41-.24-1.22.73-.85,1.34v1.58l.85,2.8-.12,1.46.24,1.71,3.29,1.59-.12,1.22h-2l-1.46.61-6.83-.73-2.56-1.71-.73-2.93-1.71-.12-1.58-1.1-.85-1.46V109l-.49-1.34-1.1-.85-2-.85-.85.12-.85,1.22-1.34.73-1.46.12-.73-1.46-.37-3.54.61-1.34,1.22-1.1,1.83-2.56L471,92.54l-1-1.83-2.44-2.32-3.9-.49-1.22-.85L462,85.47l.24-1.59,1.22-.73V81.32l.85-1,.24-.49.85-.85.85-1.83h0l1.59-.48.61-1.59,2.07-2.44,1.34-.61,1.71-.12,1.1-.73.61-1.59,2.56-1.46.61-1.34,1.34-.61,1.71-2.68,1,1.1,1.34,2.44,3.17-.24v1.83L486.52,70v1.83l2,2,.12,3.54.73,1.1,2,1.71.37,1.22-1,1.1L490.3,84l5.24,4.51.37,3.17L494.33,95l-.73.85,1,1,.24,1.34-.85,1.1.61,1.34,3.29,2.44,2.68,1.22,1.58-.49,1.1.49Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="f8107e5f-0c12-4631-aed9-d525f4e8558d"
          data-name="yilan"
          d="M466.05,182.58l-.32.79-1.12.34-2.41.17-.86.52L460.13,186l-.43,3.45-1.55,2.07-.26,1-.43.86-.26,1-2.33,3.62-.17,1.12h-1.21l-.95.43-.78.6-.27.49-.58.63.07.44.78.52.43.95.09,1.21.34.95-.86.78-.34.17-.34.52-.86.52-.95,1L449,209.6l.43.86.09,5-.52,1.21-.78.95-.95.69L446.16,220l-1.21.95-.34.86-.95-.09-2.33,3.36-.86.52-1.29-.26-.95,1.9-.95.52-.78,2-.6.78-1,.86-.86,1.72.07,1.07-.47.7,1,1.15.61,1.22.37,1.46-.61,4.88,1.83,1.83,1.34.49h3.29l2.8,4.76,1.22.61,1.83-.24.85-1.1,1.1-.85,1.59-.24,1.22-.61,4.88-.61,1.46.73.73,1.22,1.1.73.87,1.44,8.21,5.26h5.52l2.07.86,2.76.34,5.52,3.8,5.69.69,2.07-.52-2.07-1.72.52-2.07,2.24-.52,1.55-1,1.55.69,1.38-1.21-.52-1-1.38-1.21.17-2.24,1.38-.52,2.93,2.59,3.28,1,3.1,2.41,6.21,2.59,5,.34,5.52,2.76,2.82.34-.15-2.76-.51-.85.09-2.5,1.73-3.29.26-1,1-1.73.34-7.43.34-1.11.6-.79v-1.45l.68-2.41,1.22-1.64.34-1.22,1.81-1.11.68-.79.87-1.79.09-1.22,3.09-2.92,3.12-1.3h1.28l.36-.17-1-.51-.68-.7-.51-.85v-1.3l-1.73-1-.34-3.37,1.2-.77.6-.87,2.24-.43,1.9-1.2,1.13-.26.34-1.13-.09-1-.43-1.22-.09-1.22-.51-.77-.19-2.41.53-.77-.62-1,.45-1h1.28l-.17-1-.68-.6-.17-.34,1-.45-.85.19-1.22-.45-.09-.85-1.64-1.47.28-1.11,1.2-.09,1,.6.17,1.22,1.2-.09,1-.53-2.5-2.5-2.07-.68-.28-.51-.34-.11-1.11-1.54-.09-.87-2.5-6.21-.09-2.58-.53-.77.26-.43v-1.39l-.34-1.13.34-7-2-2.15-.6-1v-1.13l-.94-1.11-.43-2.33.09-1.22-.7-.68.34-9.58.45-1.47v-1.28l.85-1.9-.17-2.5.68-2.07.09-1.22,1.64-3.52.17-1.22.87-1.47,1-.51.68-2,.62-.77.94-.34,2.58-3,.87-.43,2.15-2.5.17-2.41.34-1,1.9-1.11,1-.26,1-1.47.81-.65.84-.4,1.71-2.41.19-1.28,1.2-.7,1.22-.17.85-.34.77-.76,1.13-.17.85-.53,1.3-.09,1.85-.84-2.48-.49-1.71.12-4.27,1.59-3.66.24L549,118.15l-1,1.1h-2l-1.59-.61-3.54-.24-1.22,1-.37,1.46-.61,1.22,2.8,4-1,2.93-4,2.68-3.66-.24-1.59.24-2.07,1.71-1.71,2.19.37,1.58-.12,1.46-1,1.22-.12,1.46.12.85-1.71.37-1.22.61-5.12-.73-1.59.24-1.34.73L514,145.59l-3.29,1.77-.37,1.16-1.22,1.1-.73,1.22-1.46.49-.49,1.34-1.1-1.22-2.44,1.22-7.19.85,1,.85-.37,1.46-1.58,1.22-1.71-.49-1.22.73-1.46.36-.61,1.34.12,1.71-.24,1.58-1.34,1.1.24,1.71,1,1,.49,1.46v1.83l-1,2.93-1.58.24-1.1.85-.73,1.1-1.46.49-1.83.12-4,2.19-.37,1.71-3.54,2.32-3.17.49-1.58,1-3.51-.2h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="65175d47-0a21-4bf1-abfb-b58e4d3069a0"
          data-name="taoyuan"
          d="M466.11,182.57l-.37.8-1.12.34-2.41.17-.86.52L460.13,186l-.43,3.45-1.55,2.07-.26,1-.43.86-.26,1-2.33,3.62-.17,1.12h-1.21l-.95.43-.78.6-1,1.32-.52.31-1.21.26-2.5-.34-1-.6-.86-1.29H444l-.52-.69-.34-1-.95-.34v-2.67l.52-.95L443,193l-1-.52-1.12-.17-.86-.52-.09-2.59.69-.69.09-1.29.35-1-.17-1.29-1.12-.52h-1.29l-.43-.86-.17-1.21-.52-.86-.78-.6-1.55-2-2-.95-2.07.69-.95-.34v-2.59l.78-.78.43-.86v-2.59l-1.47-.26.09-3,.34-.95.6-.86.26-1.12-.86-.86-.43-1-1.21-.26-.86-.86-.95-.35-1.21-.09-.35-.52h-.17l-1.12-.6-.69-.86-1-.6-.26-.43-.09-.78-.6-1.64-1-.43-1.47-.26v-1.29l-1-.34-2.67,1.21h-1.12l-3.88-3.1-.95-.43-.78-.78-1.38-.52v-.95l-1.29-.17-1.21-.43-2.41-1.9-.43-.61-2.07-1.29.26-1.12,1.21-1.9-.34-3.79-.95-.69-8-.69-.52-1-.17-1.29.69-.6-.95-.52-.86.6-1.12.43-1.29.09-1.12-.86-1.38-.43h-1.29l-.86-.95-2.07-.78.09-2.5.43-1-.78-2.07-.09-1.21-1.21-.09-1.47-1.47-2.5-.17-2.93.86-1.55-1-2.93,1.72-2.12-.57.32-.54.85-.7,2.07-2.75.43-.94.87-.87.85-.51,1.22-1.3v-2.5l-.62-.85.09-1.22,2.07-2.58.7-2,.77-.6,1.64-2.41,3.18-2.77,2.69-1.2,1.11-.17.79-.79,1-.34,1.73-1.11.85-1,1.13-.68,1.2-.34,1.9-1.47,1-.43h1.37l8.28-2.16,1-.87,2.41-1.11,2.5-2.5,1.13-.7,1.45-.09,5.7-2.33h1.3l.68-.68,2.41-.51,1,.34,1.71,1.37,1.61.05.54,1.28.85,1,.85.24.85,1.1,3.41.37,6.34,3-.37,2.44,1.34,1.22,3.54.85h3.66l.85.61,1.22,1.46.37,1.59v.49l-.61,1.22.24,1.58.85,1,1.59,1.1-.61,1.1-1.34.85-1.34.49,1.46,1.1.12,1.46-1.1.73-1.46.49L446,114l-2,1.34-7.68-.24-1.22.61-.37,1.46.73,1.34-.37,3.41-1,1-.61,1.34.85,1.59,1.46.12,1.1.85-1.46,1-.85,1-.61,1.34.61,2.93,3,1.83,2.32,3.54-.85,1.1.24,1.46,1.83,1.22-1.1.85-3.17.61-.12,1.46,1.71.24,1.1-.85,1.1,1.1,1.22.73,2,.49,1.83-.12,1.34-.73,3.66-.24.85.49.24.61,1,1,.49,1.34,2,2,1.1.61,1.1,1.22.12,1.71.61,1.71,1.59.49v1.83l-1.1.73-.73,1.1-2.2,1.83L455,163.6l.24,1.59.61,1.22v.73l1.34,3.41,2.19,2.07-.37,1.34,1.71.73.12,1.22,1.71.49,1,1.34,1.34,1,.37,3.41.82.44h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="350fa9bc-d25e-4c61-ae4b-b5c60b1a74b6"
          data-name="hsinchu"
          d="M344.7,169l.14.72.86.43h1.38l.95-.34.78-.6.95.34,1.29,1.55.34,1.12v1l3.33.86.47-.34,1.38-1.64.26-2.5.86-2,1.12-.26.69-1,1-.43.78-.6.34-1,.6-.95,3.71-.86-.34-.95.78-1.21,1-.35h1.29l4.83,4.91,1-.69v-2.59l-2.24-7.59-1.29-1.81-2.33-2-2.5-.26-.09-.43-.35-.69-.95-.6h-1.29L358.3,147,357,145.17l-.34-.95-1.1-.79-.7.53-1,.43-3.46,4.76-.85.77.43,2.07-.17.68.34.36,1.3.09.17,1.11-.51,1-.26,2.41-.53.77-.09,2.67-1.28,1.73-.34,1,.94.77-.51.68-.43,1.22L347,168l-1.22.68-1.09.32h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="ea41be52-3728-49f2-aa36-b90633ee55f6"
          data-name="hsinchu"
          d="M433.44,234.93l-1.16.61-.43.95L431,237l-4-.09-.86.43-3.88-.09-.61-.69-.09-1.47.17-.86-.43-.52v-2.59l-.6-.86-1-.6-.78-.86-.43-1L417,226.14l-.43-1-1-.52-.52-.78-1.12-.6-.34-.86.17-2-.78-1-2.5-.17-1,.35-1.81,1.21h-2.93l-.95.52h-1.29l-.86-.78-5.17-.26-.95.34-1-.26h-1.29l-1.47,1.29-2.33.95L387,222h-4.05v-1.47l-.6-1.29v-1.38l.52-1,1.47-1.55.34-1-.09-1.29-1-2-1.81-1.47,1.38-2.24.78-2.85.78-.95.09-1.21.6-.86.26-1.12-.95-.52-.78-2.33-1.29-.34-.95-2.16-.6-.26-1.38.34-1,.6L377,194.32l-.6-1-1.12-.26-.86-.6L373,190.27l-1.21-.17-1.21-.52-.09-1.21-.78-.86-1.21-.17-2.24-1.47-.6-1-.95-.95-1.12-2-.17-1.21-1.38-.52.26-.86.6-.95.17-1.12.69-.86-.95-.52.6-.78-2.41.17-.86.69-1,.43-.6-.78h-2l-1-.52-.68-.83,1.71-2.11.26-2.5.86-2,1.12-.26.69-1,1-.43.78-.6.34-1,.6-.95,3.71-.86-.34-.95.78-1.21,1-.34h1.29l4.83,4.91,1-.69v-2.59L372.34,154,371,152.23l-2.33-2-2.5-.26-.09-.43-.35-.69-.95-.6h-1.29L358.28,147,357,145.16l-.35-.95-1.08-.86.39-1,1.39-1.73.34-1.22.68-.6.43-2.33,3.8-4.74-.51-1-.26-1.3,3.74-5.39,2.12.57,2.93-1.72,1.55,1,2.93-.86,2.5.17,1.47,1.47,1.21.09.09,1.21.78,2.07-.43,1-.09,2.5,2.07.78.86.95h1.29l1.38.43,1.12.86,1.29-.09,1.12-.43.86-.6.95.52-.69.6.17,1.29.52,1,8,.69.95.69.34,3.79-1.21,1.9-.26,1.12,2.07,1.29.43.6,2.41,1.9,1.21.43,1.29.17v.95l1.38.52,5.6,4.31h1.12l2.67-1.21,1,.34v1.29l1.47.26,1,.43.6,1.64.09.78.26.43,1,.6.69.86,1.12.6h.17l.35.52,1.21.09.95.35.86.86,1.21.26.43,1,.86.86-.26,1.12-.6.86-.34.95-.09,3,1.47.26v2.59l-.43.86-.78.78v2.59l.95.34,2.07-.69,2,.95,1.55,2,.78.6.52.86.17,1.21.43.86h1.29l1.12.52.17,1.29-.35,1-.09,1.29-.69.69.09,2.59.86.52,1.12.17,1,.52-.26,1.21-.52.95v2.67l.95.34.34,1,.52.69h.6l.86,1.29,1,.6,2.5.35,1.78-.49,1,.66.43.95.09,1.21.34.95-.86.78-.34.17-.34.52-.86.52-.95,1L449,209.6l.43.86.09,5-.52,1.21-.78.95-.95.69L446.16,220,445,221l-.34.86-.95-.09-2.33,3.36-.86.52-1.29-.26-.95,1.9-.95.52-.78,2-.6.78-1,.86-.86,1.72-.09,1.21-.48.58"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="ffd01e75-6ce2-4cfa-af98-bc61479c68ed"
          data-name="miaoli"
          d="M355.53,175.1l1,.52h2l.6.78,1-.43.86-.69,2.41-.17-.6.78.95.52-.69.86-.17,1.12-.6.95-.26.86,1.38.52.17,1.21,1.12,2,.95.95.6,1,2.24,1.47,1.21.17.78.86.09,1.21,1.21.52,1.21.17,1.38,2.16.86.6,1.12.26.6,1,1.64,1.29,1-.6,1.38-.34.6.26.95,2.16,1.29.34.78,2.33.95.52-.26,1.12-.6.86-.09,1.21-.78.95-.78,2.85-1.38,2.24,1.81,1.47,1,2,.09,1.29-.34,1-1.47,1.55-.52,1v1.38l.6,1.29V222H387l2.33.52,2.33-.95,1.47-1.29h1.29l1,.26.95-.34,5.17.26.86.78h1.29l.95-.52h2.93l1.81-1.21,1-.35,2.5.17.78,1-.17,2,.34.86,1.12.6.52.78,1,.52.43,1,1.47,1.64.43,1,.78.86,1,.6.6.86v2.59l.43.52-.17.86.07,2.64-1.22.61-1.34,1.1-1,1.22L418,242.4l-2.32,3.78V248l-1.46.37H412.4l-1.22-1.71.61-1L410,245l-1.34.61-.49,1.46-.85,1.22-1.58.49-3.29,4.63-1.34.49H397.4l-1.22.85-.49,1.34-.49.12-1.34,1.46-.24,1.71-1.46.37-2.32,1.95-1.46.37-3.41-.37-3,1.1-3.66,4.63-1.83.12-1.34-.73-2.2-2.07-.24-1.71-1.22-.85-1.83-2.68-1.1.24h-1.83l-1.34-.61-3.41-.24-4.15-1.46-3.29-.12-1.46.61-1,1v1.83l.61,1.34.24,3.41-.61,1.34-1.22,1-1.46.49-7.07-.24-1.34.61h-3.66l-3.54-1.1-2.19-2.07-.73-1.34-1.1-.85-7.68-1.46L320,259.84l-1.71-.49-1-1.34-2.44-1.34-1-1.1-1.46-.49-.85-1.1-.61-.24-2.07-.24-.85-1.22-2.19-1.46-5.12-6.59h-.24l-.61-1.22-3-1.22-1.59-2.56-.24-1.34-2.57-3.22,1.08-.48L296,232l2.07-2.69.43-.94,3.54-4.65.85-2.15,1-1.3,6.47-19.23,1.54-2,.09-.51.79-.85,2.16-.53,1.81,1.56.77,1.13.26-1-.26-1.39,1.81-1.11h.94l.7.17-.09-1.13-1.13-.51-1-.77.68-.6.43-2.24,2.07-3.63,1.13-.17,1.37-1.64,3.8-.17,3-1.39h1.64l2.67,1,.7.68,1.54.34.87-.51-.51-.68-1.3-.17-1-.45-.53-1.11-1.2-.17.09-1.22.68-.77,1-.51,3.78-3.2.36-1.11.6-.79.26-1v-1.3l.85-1.9.87-.77.6-.87,1.32-.58.32.67.86.43h1.38l.95-.34.78-.6.95.34,1.29,1.55.34,1.12v1l2.76.78,1.37,1h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="d5701392-fc06-4411-bf79-2703f225ab2e"
          data-name="changhua"
          d="M216.61,369.81l4.31,1.55,2.59.17,4,1.21,11-.52,1.9-.69,10,.17,1.72-.86,3.45,1.9.52.86,2.93.34,5.52,2.76,4.31,1,5-.17,2.07-.52,20.87,3.45,4-1.21,1.38-1.21.86-1.72v-2.24l-1.38-.34-1.72.86h-2.24l-1.72-.86-5-5.35.17-1.55.86-1.72-1.21-1.38,1-1.72.34-2.24.86-1.72.86-6.55-.34-1.9.34-1.55-.69-3.79,1-1.55,1.38-1.21.86-1.72.17-2.41-.86-1.9-1.21-1.38-.34-.17.17-2.59h5.17l2.73-1.55-3.93-3.27-.73.49-2.44.24-1.1-1-1.71-.12-1-4.76.61-1.34v-2l-1.22-1-1.1-1.46V312l-.24-.61-1.1-.85h-1.71l-5.12-1.46-1.83-.12-1.34-.73-1.46-.37-1.1-.85-1.34-.61-1-1.59h-.37L271.9,304l-.85-1.1.12-1.71.85-1.1-2.2-2.32-.24-1.83-.73-1.83-.24-1.59-1.46-2.32-3-1.35-1,.25.34,1,.45.6-1,.53-2.22,2.84,0,.09-1.81,2.92-.85.53-3.8.09.17,1,1,.87-.09,2.5-.7.6-.43.94-.26,1.22-.6.85-.09,2.6-.09.26-.7,1v1.3l.43.85-.17,1.3-.94.85-2.07.79-.51,1.2-1.56,1.64-.17,2.41-.43,1-1.81.34-1,.77-1.11.17-1.64,1.22-.94.34-.26,1.11-2.77,2.07L237,329v1.47l-.6,1-.17,1.11-.87.6-.43,2.24-1.64.11L232,335.3l-1,.79-.68,3.35.26.79h2.58v.6l-3.27,4.91-.17-.09-.28,1.39-.6.77-.26,1-.68.68-.87,3.29-1.45,1.62-.36,1.26L224,357.43l-.43,1-.62.7-.17,1.49-.85.45-.77.68-1,.51-.6.87-1,.51v.94l.62.87-.45.34h-1.28l-.6.85-.19,2.5-.26.7"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="4eed8214-870d-46ff-b77b-49234479d430"
          data-name="yunlin"
          d="M313.19,420v-2.07l-1.55-1.38-2.24-.34-.69,1.9-1.9.35-2.24-.52-.52,2.07-2.07.34-2.41-.17-1.55-1-1-1.9-.52-2.07-3.28,2.41-.17-5,1.38-4,.17-.17,1.21-2.76.34-2.24-.17-2.41-1-1.72-.17-5,.52-2.07,1.9.34.35-4.83-3.45-7.42-14.14-2.07-2.59-1-1.38-.17-7.07.69-9.83-3.8-2.93-.34-.52-.86-3.45-1.9-1.72.86-10-.17-5.17,1.38-7.76-.17-4-1.21-2.59-.17-4.4-1.51-2.67,0-.85-.45-1-.17-.34,1-1.2.09-4.14,7.41-.09.45-1.47-.09-.87.51-1.37,1.64-.43,1.11L202,384l-.7.79-.17,1.11,1.13,1.64-.17,1.22-1.13,1.62-2.16.09-.26,1v1.28l-1.47.79v1.64l-.09-.09-.34.17-.26,1.11v1.3l.34.94,1.3.09.94,1.39-1.56,1.9-.94,1.9-.26,1-1.3,2.16-.68,2.41-.87,1.3-1.79,5.08.17,5.1-.26,1,.09,1,1.2.6-.09,1.13-1,.43-1.47,1.11.34,1.47.77.43,1,.17.09,1.3-.68.85v2.58l.85.62,1.39,1.9.94.77-.85.51-.62,1.13-1.2.09-.34-1-.7-.6-1,.6-1.51,1.73,2.63.09,4,1.55h2.59l1,1.55h2.59l1.9-.86,4.31,1.55,2.59.35,1.55-1.21,1.21-1.55.17-2.41-.52-2.07,1.38-1.38h2.24v2.24l2.41.86.69-1.9,3.28-1.9.52-2.41,1.21-1.38,4.31-1.72,1.9,1,1.21-4.14,1-1.72,2.76.17,1.72-.86.69-2.07,4-1.21.69-1.9,1.55-1.21,1.21-1.55,1.9.86,1.55,1.21,1.9.69,4-1.55h5.17l3.62-1.9L267,415l1,3.45,2.93,2.41,1,1.55,1.72,1,2.41.17,1.55,1.21,2.07.69,9.49,1,1.9-1,1.21-1.38,3.79.17-.34,2.59,1.38,2.24,1.38-1.38,2.24-.52,1.38,1.38,2.07-.17,1.9-.69,2.41.17,1.9,1,2.41.34.86-1.72v-2.41l-.52-2.07-1-1.55,1-1.55h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="e468a7aa-2bdf-4501-b48d-35483b7c8ccc"
          data-name="hualien"
          d="M469.84,460.31l-2.29-.65L466,458.45l-2.07-.52h-2.59l-1.9.69L456.51,461l-5,9-.17.17.35,3.1,1.38,1.55,2.24,1.21v.17L447,488.81l-.34,6-1.21,1.55-1.55,1-.86,1.72-1,4.14-1.55,1.21v2.59l-1,1.9-.17,1.9-2.07,4-2.93,2.41-.69,1.9.52,2.41v7.76l-.69,1.9-6.73,1L425,533.48l-1.38-.17-.17-2.41-1.21-2.24-1.38-1.21-3.1-.17-.69-.52-1.21-1.55-2.07-.69-1.72-1v-1.9L409.43,518V515l-.86-1.9-1.21-1.55-3.45-2.24-3.62,1.72-.34.86h-.69l-1.9-.86-.86-1.72-2.41-2.76-2.41-.17L388,504.16h-2.93l-.86-1.72-.52-.52-2.59-6.21.17-2.59-2.59-3.28-.52-1.72.52-2.07-.17-2.41L368,476.39l-2.07-.52.69-2.41,1.21-1.72,2.24-.69-.34-1.55,1-1.55,2.24-.35,1-1.55v-4.83l-1.55-1-.35-1.12.86-.78,2.07-.52,2.07-1.38,2.07-.52.52-2.41-.69-2.07-1.55-1.21,1.21-1.38.52-2.24,1.38-1.55,1.55-1,.52-2.07,1.55-1,2.41.17,1.9-.86h2.59l.86-.35,1.72,1,2.07.52,3.28-2.76v-5.17l.52-2.07,1.55-1L399.6,426l1.72-.86,2.59.69,1.9-.86,1-1.55,2.24-1,3.1-.17,2.59-5.69.86-7.07.86-1.72v-2.59l1.38-3.8V395l-1.72-1.55L416,391l.52-1.9-5.52-4,.17-2.41,2.24-.52,2.07-1.55v-1l-.52-2.07.34-2.41,1.55-1,.69-2.24.17-2.59.69-2.07,1.38-1.72.17-2.59,1.55-1.55,2.07-.52-.34-3.8L422,355l2.93-2.59-.17-2.07-.69-2.24V345.5l.52-1.38v-5.17l-1.38-1.72-.69-.17v-2.41l4.14-8.8.17-5,1.55-1.55,1.72-.86,1-1.72,1.72-.86,1.38-2.41.52-1.72.17-2.41-1-1.55-2.41-.34-.69-1.9-1.21-1.38-2.59-.86-.52-.69-.17-4.31,1.9-4.48,2.07-.52,1.38-1.21,1.9-.86,2.59-2.59h2.59l1-1.55-1.2-3.82,1.36-1.06.61-1.22-.12-1.71,2.56-1.1.73-1.1,1.83.12,1-.85.37-1.59-.61-3.17.85-1.34,1.59-.61,1.1-.73,1.22-2.8,1-1.1h1.83l1.22-.85,1-1.22,1.46-2.93.49-5,.61-1.34,1.58-.85.87-1,8.21,5.26h5.52l2.07.86,2.76.34,5.52,3.79,5.69.69,2.07-.52-2.07-1.72.52-2.07,2.24-.52,1.55-1,1.55.69,1.38-1.21-.52-1-1.38-1.21.17-2.24,1.38-.52,2.93,2.59,3.28,1,3.1,2.41,6.21,2.59,5,.34,5.52,2.76,2.84.34-.09.87-.43.85-1,.45-.62,1L522.91,268l-1.81,2.67-.09,3.8-.79.6-.77,1.81-1,.43-.53,1.3-.17.09-2.41.26-2.07,3.71-.85.68-1.13.17-2.24,2-1,.26-.62.77-.85.53-2.67,3.61-.7,2.24v3.88l1.64,2.95-.51.51-.34,3.54-.17.34-.26-.17-1,1.66-.94.32-2.2,2.54-1,.56-3,3.2-.43.94.09,8.11.43.85.34,2.24,4.91,5.1v1.28l-.68,2.33-1-.26-.26,1.13.45.85-1,.34-.77,1.73h1.11l-.51,2.07-1.3.09-.51-.77h-1l-.7.6L494.1,340l-.77.77-.7,2.07,1,2.07.09,3.8L493,351l-.09,3.61-.36,1.13-.09,3.8-.43.85-.26,2.33-1.3,2.95V367l-.43,1-.17,1.11-1.28,2.69-.19,1.2-2.24,3.29-.43,1.45v7.17l.34.94-.94,4.4-2.41,3.71-1.13.77v1.22l-.43.94-.09,1.22.6.43.51,1.73-.6.77-.17,1.13-.43.85-.6,4.74-.62.7.09.85.53.79-.7.77-1,.43-.34,2.33-.87,1-.09,8.71-.6,1.2-.09,2.69-.6,2.07-1,.85-.26,1.13-1.11,1.62-.11,1.3-.85,2.24-.09,2.5-.6,1-.17,1.45.34.26.43,1.13v2.58l1.13,1.73-.09,2.5-.36,1-.68.77-1,.43-1.22.09.26.34,1.13.7-.53,1v1.3l-.6,2.24v1.3l-.43,1-.47.56h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="7ed22330-8901-4fc6-a351-206f6b2daf2b"
          data-name="nantou"
          d="M294,380.33l3.45,7.42-.34,4.83-1.9-.34-.52,2.07.17,5,1,1.72.17,2.41-1,4.14-.52.86-.17.17-1.38,4,.17,5,3.28-2.41.52,2.07,1,1.9,1.55,1,2.41.17,2.07-.34.52-2.07,2.24.52,1.9-.35.69-1.9,2.24.34,1.55,1.38.07,2.06,4.42-.51,7.93,2.93h2.59l2.24.52.86,1.72.17,5.86-.52,2.24-1.9,1.55v2.59l1,1.72,1.55,1.38.34,5,1.72,4,1.38,1.55,7.76.86,3.79-1.55,7.59.69,1.9.69,8.11.52,4.31,1.55h.34l1.72,1.21.86,4.31.69.35.86-.86,2.07-.52,2.07-1.38,2.07-.52.52-2.41-.69-2.07-1.55-1.21,1.21-1.38.52-2.24,1.38-1.55,1.55-1,.52-2.07,1.55-1,2.41.17,1.9-.86h2.59l.86-.34,1.72,1,2.07.52,3.28-2.76v-5.17l.52-2.07,1.55-1L399.59,426l1.72-.86,2.59.69,1.9-.86,1-1.55,2.24-1,3.1-.17,2.59-5.69.86-7.07.86-1.72v-2.59l1.38-3.8V395l-1.72-1.55L416,391l.52-1.9-5.52-4,.17-2.41,2.24-.52,2.07-1.55v-1l-.52-2.07.34-2.41,1.55-1,.69-2.24.17-2.59.69-2.07,1.38-1.72.17-2.59,1.55-1.55,2.07-.52-.34-3.8L422,355l2.93-2.59-.17-2.07-.69-2.24v-2.59l.52-1.38v-5.17l-1.38-1.72-.69-.17v-2.41l4.14-8.8.17-5,1.55-1.55,1.72-.86,1-1.72,1.72-.86,1.38-2.41.52-1.72.17-2.41-1-1.55-2.41-.34-.69-1.9-1.21-1.38-2.59-.86-.52-.69-.17-4.31,1.9-4.48,2.07-.52,1.38-1.21,1.9-.86,2.59-2.59h2.59l1-1.55-1.17-3.85-1-.54-3.29-.73-.85-.85-3.29-.37-.73,1.1-3.54-.24-1.46-.49-.73-1.1-2.2-1.59h-.61l-1.59,2.56L419,282.4l-.85,1.46-1.34.49-1.71-.61L414,283l-2.8,1.22h-1.83l-1.22.73-.61,1.22-2.93-.85-.85-1-1.34-.61-1.1.73-.85,1.1-1.71.12-.49,1.34-.85,1.34-1,.85-7.2.12L388,290l-.37,1.46-.85,1.34-1.22.73-.85,1.1-1.34.85-.85,1.34-2.68,1.34H377l-1.1.73-2.93-.37-1.71.37-1,1L369,304.1l-1.83,1.83-1.22.73-3.54.12-1.58-.37-1-.85-1.58.24-4.15,3.54-1.71.37-1.71-.24-2-1-.24-.37-1.1-1-.73,2.93L346,311.3l-1,.85-.49,1.1-.73-.37v-3.66l-1.1-1-3.17-.61-.73-1.1-1.58-.49-1.1.73-2.56,5.12.24,4.51-.85,1.1-3,.85-2.2,2.2-2.56,6.71L320.8,332l-2.93,1-1.46.12-1.22-1.1-1.71-.37h-3.66l-1.46.37-6.15-2.25-2.64,1.58h-5.17l-.17,2.59.34.17,1.21,1.38.86,1.9-.17,2.41-.86,1.72-1.38,1.21-1,1.55.69,3.79-.34,1.55.34,1.9-.86,6.55-.86,1.72L291.8,362l-1,1.72,1.21,1.38-.86,1.72-.17,1.55,5,5.35,1.72.86h2.24l1.72-.86,1.38.34v2.24l-.86,1.72-1.38,1.21-4,1.21-2.75-.17h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="ae9239f1-7686-4c40-a5f8-f322391c7328"
          data-name="taitung"
          d="M469.77,460.35,468.24,465v1.3l-1,.6-1.2,4.76L466,475.6l-1.22,2.6.09,3.78-.77,3.8-1,.7h-1.28l-1,.26-.85.68-.77,2.16-.53.85-.94.87-.43.94-.09,1.13-.79.77-.26,2.77-.68.85-1.64,6.64.6.77.36,1-.53.85-1,.79-1-.17-.6-1-.77.34.68.7.09.94-2,1.39.21,5.42,1.3,2.58.26,1.22-.17,2.5-1,1,.09,3.69,2.07,2.16-.6,2-2.5.09-.85.7-1.47,2.84-.87.43-2.58.09-.6.79L442,536v1.3l-.53.85v1.3l-1.37,2-1,3.37-.68.94-.6,3.88-.79,1.13-.17,1.11-.77.53-.7.77-.68,2-.68,1.11-.87,3.46-.51.6-.34,1v1.28L430,565l-.34.94-1.22.09-.77.68-.6,1-.45.17L426.5,570l-2.33,5.08-1.47,1.39-1.45,3-.43,2.15-.79.7-1,.26-1.64,1.73-.09,2.07-2.16-.53-1,.36-2.33.34-4,3.26-.51.79-.17,1.11.43.87,1.22,1.37.26.87h-1.3l-.51.85.43.85.87.45.68.77L409,599l.77,1.88-.34,1.13-1.45,1.3-1.13.17-.94.94-.87,5.44-1.47,1.37-1.88.79-.79.68-.51.85L398.66,615l-.51.77-.77.53-1,.43-2.58,3.09-1.81,1-1,.26-.68.6-.94.43-1.3.19-.68.68-1.22.09-.6.77-1.64,1-.68.68-1.81.85-.26,1-.68.85-1.22.09-.77.7-2.77,1.2-.77.7-1.13,1.79-.6,2.16-.77.87-.17,1.11-.62.79-.09,1.2-.51,1,.09,1.2-.13.41-.13,3.56-.51,1,0,.94-1.34,1.94-2.41,2.16-.6.87-1.13.6-.51.85-.17,1.13-.6.85-.09,1.22-.45,1.11V659l-.85.51v1.73l-2,4.65v1.3l-.6.6v2.58L358,673.25l.09,1.45-.85,1.13-.36,2.41-.6.77-.17,2.41-.68.87-.26,1.2-1.3,1.73-.34,1-.6.77-2.43,6.89-.6.87-.34,3.44-1.73,1.73-2,6.21v2.41l-.43,1,.17,3.69.87,1.13v5.34l.6,2.16.06,3.17-2.39.8L343.39,727l-2.24.86-1.9-3.28-2.07-.52h-2.76l-.86-1.9-1.9-.69-1.55-1-2.93.17-.34-1.55.52-2.24,1.21-.69-1.9-.69-.69-1.72-3.28-1.9,1.21-1.55,1.72-.86-.17-5.17-1.72-1-.86-1.72H321l-2.59-2.76L316,697.47l3.28-10,4.48-.69.86-1.9-.52-2.24-1.9-1.38-1.72-3.62-2.76-1.72-.17-2.07-.69-2.07,2.93-2.24v-2.59L317,661.43l-.35-2.93-1.21-.69-.69-2.07.34-2.41,1.9-3.45-.86-1.9,1-1.55.69-1.9-.17-2.41.69-1.72,1.38-1.38.52-2.07,1.21-1.38.17-.69,2.76-3.8.17-2.41,1.21-1.55.17-1.72,2.24.34,2.41-1.21,4.14-.86,2.07-4.31,7.59-.35,1.38-1.55L346,615l1.21-1.38.34-6.73,1.38-1.38-.69-1.55v-2.59l-.69-2.24-1.72-.86-2.24-.17-1.9-1.72-.52-1-.52-2.07v-2.59l.31-.66.49-4.63-2-2.68-3.66-.24-2-5.85.24-3.41-1-1-1.22-2.68v-3.66l.73-2.93,6.83-8.78L340,553V550.3l4.39-3.17-1-2.93-1.71-1.71,1.22-2.93,2.44-2.68-.73-15.37,2.2-1.46,1.46-3.41,2.44-1.22-.73-2.68v-2.68l1-2.68-.24-1.22-.73-.49,2-2.44,2.44-1,4.63-3.9,3.41-4.39h2.68l5.37-1.46,2-2,5.72-2.44.62,1.72,2.59,3.28-.17,2.59,2.59,6.21.52.52.86,1.72h2.93l3.62,2.24,2.41.17,2.41,2.76.86,1.72,1.9.86H400l.34-.86,3.62-1.72,3.45,2.24,1.21,1.55.86,1.9v2.93l2.59,3.62v1.9l1.72,1,2.07.69,1.21,1.55.69.52,3.1.17,1.38,1.21,1.21,2.24.17,2.41,1.38.17,1.72-1.21,6.73-1,.69-1.9v-7.76l-.52-2.41.69-1.9,2.93-2.41,2.07-4,.17-1.9,1-1.9v-2.59l1.55-1.21,1-4.14.86-1.72,1.55-1,1.21-1.55.34-6,8.28-12.59V476l-2.24-1.21-1.38-1.55-.35-3.1.17-.17,5-9,2.93-2.41,1.9-.69h2.59l2.07.52,1.55,1.21,2.2.7h0Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="0ce2847a-4f9c-4ff7-8c51-6b0fa24ba8b7"
          data-name="tainan"
          d="M252.82,464l-.17.34-1.56,1-2.24.17-1.37-1.37-2.24.34-3.63,1.73h-5.19l-4.12,2.41-.19.17-1,1.73-4.31-.19.17,2.07-4.82.36-.36,2.24-.85,1.71-1.22,1-1.71-1-1.39,1.39.68,1.9-.34,1.22-6.55,3.27-.51,2.07-2.24,3.29-2.07.85-3.12-.85-.85-1.39v1.9l-1.73-.17-1.56-1.39-.68-2.07-2.58-.51L193.17,485l-.53-.66-4.91-.87-2.67,4.65.43.87.68.09-.43,1.28-.87.62-.17,1.2,1.9,1.13.79.17,1.11-.34L187,495.27l-2.33.85-.6.87.17,1.2.51,1-1.71,1.62L182.8,502l-.51.94-1.64-.43-.43.87-.51,2.33.09,2.58-3.37,6.3-.34,2.41-1,1.73.77-1,1-.43,1-.09.43,5.44.79.6,1,.43-.6,3.63-2.24.94h-.17l-2.41.79-2.16,2-2.24,1-.17,2.41.17.34.17,2.52.51.6h1.3l-.09,4.05.51,1.64,1.45,1.71.19.53,1.28-.45.87-.6.7-.73.23,1.07-.17,1.22,3.18,1.9.62.17,1.2,1.11,2.16,1.13,2.69,2.84,1,.51,3.63,3.37.09.34L194.2,560l1.64,2.5,1.11-.26,1.56-1.45.94-.53-.68,1.47-.6.77v.87l2.24.6-1.13,1-1.28-.09-.7-1-.6-.34.51,1.3.79,1,.34,1.13-.34,6.55-.36.94.68,1.39.87-.51,1.39-1.39,1-.38,0,0,5.8,2.13,1.73-.87,1.2.7,2.58,2.75h2.41l.36-.51,1.9.85,1.37.17,1-1.39,12.25,2.77,2.58-.17,4.31-4,1.2-1.73,2.07-.68,2.41-.17,1.73,1h2.07l1-4.31,1-.51.7-.87.34-2.24,2.58-6,2.07-.51.68-2.07.17-2.41,3.8-.17.17-2.41,6.21-4.48,2.41-3.8,7.09-4.82,1.54-1.73,2.58-1.56.36-2.07.17-.17.85-.51.34-2.41.87-1.73.17-2.41,3.8-4.65,1.2-.17L294.4,515l.17-2.58,2.75-3.46.51-2.07-1.54-1.2-.19-.34-.68.51-1.73-.85-4.31.85-2.07-.68-2.41-1.73-2.58,3.8-2.07.51-2.24-.17-2.92-2.07-4.14-1.22-.7-1.71,2.24-3.29L272,497.6l-1.37-2.24-.36-1.73.87-1.71-.7-1.9-.17-2.41,1-1.9,1.56-1.22.17-2.07-.7-1.9-2.41-.17-2.58-.85-.68-1.56,1.71-1.2-.17-2.24-5.34-.36V471.9l1.73-1.2,1-1.56-1.39-1.22-1.54.87-2.07-.51-1.73-1.39-2.24-.68-1.22-1.56-2.58-.68Zm-45,75.19,4.31,1.88v0l-4.31-1.9Z"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="e1806d87-d003-48dd-b8d3-3f99b3759340"
          data-name="kaohsiung"
          d="M236.26,665.5l4.67,3.8,1.2.51,1.9,1.73,3.71,1.11.17-.43-.6-9.92.6-2,.6-.77,1.26.3,1.68-1.51,1.38-4L253,652l1.21-4.14v-2.59l-2.41-2.93.17-12.42,1.38-4.14,1.21-1.55,1.21-4.66-.17-3.1.52-.86-.17-10.35.86-1.9.34-2.24.86-1.72,1-6.73,1.72-.86,1.21.52,3.1.17,1,1.55h2.59l1.9-.86,4.14,1,2.41-.17,1.55-1.21,1.72-2.24.17-.86,2.76-2.24.86-.35,4.48-3.1,2.41-.17,1.9-1.38,2.07-.52,2.07.86,1.21,1.38v2.59l1.9.86h1.9l.69-.69,2.07-.52,2.24-3.28,2.07-.52h2.59l5.86,3.62,4.31,5.17,1.9,1,1.9-1,1.21-1.55,3.45-1.72,1-1.55h2.24l.69.17,1.72.86.17.86,1.55-.52,3.07,2.07.49-4.61-2-2.68-3.66-.24-2-5.85.24-3.41-1-1-1.22-2.68v-3.66l.73-2.93,6.83-8.78.49-1.22v-2.68l4.39-3.17-1-2.93-1.71-1.71,1.22-2.93,2.44-2.68-.73-15.37,2.2-1.46,1.46-3.41,2.44-1.22-.73-2.68v-2.68l1-2.68-.24-1.22-.73-.49,2-2.44,2.44-1,4.63-3.9,3.41-4.39h2.68l5.37-1.46,2-2,5.8-2.43.54-2.08-.17-2.41L368,476.39l-2.07-.52.69-2.41,1.21-1.72,2.24-.69-.34-1.55,1-1.55,2.24-.35,1-1.55v-4.83l-1.55-1-.41-1.19-.63-.19-.86-4.31-1.72-1.21h-.34l-6.73-1.9-.69.17-1.72.86-4.48.69-1.55,1-4.31.86-2.93,2.41-1,1.72-1.9.86-1.55,1.21-2.24.34-1.55,1.72-1.21,2.93-1.21,1-.69,1.9-1.21,1.38-.17,2.41-1.9.69h-2.59L327.51,475l-1,1.72-2.76,2.76-4.83.34-1.55,4-3.45,1.72-.69,1.9-4.48.34-.86,4.48-5.52-.17-1.55-1.38-5.35-.17-.86,7.93.86,1.9,1.38,1.72v2.59l-.75.74h0l.23.3,1.55,1.21-.52,2.07-2.76,3.45-.17,2.59-5.52,7.42-1.21.17-3.79,4.66-.17,2.41-.86,1.72-.34,2.41-.86.52-.17.17-.34,2.07-11.21,8.11-2.41,3.79L261.28,553l-.17,2.41-3.8.17-.17,2.41-.69,2.07-2.07.52-2.59,6-.34,2.24-.69.86-1,.52-1,4.31h-2.07l-1.72-1-2.41.17-2.07.69L234.89,580l-2.59.17L225.4,578l-5.35-.52-1,1.38-1.38-.17-1.9-.86-.34.52H213l-2.59-2.76-1.21-.69-1.72.86-5.77-2.18-1.13.45-2.21,2.05.82,1,.51,2.86,2.07,4.31v1.28h.45l.17-1.11.43-.87,1.3-.09,1.45,3.46L205.4,588l-1.28.17-1-.6-.51-.85-.26.6.09,1.22L203,590l.09,1.22,1.22,2.33v.94l6.1,14.41.11,1.22,1,2.33.94,1.2,2.12,4.51,1.17,2.58,3.09,3.8-1.45,1.71-2.67-2.67,1.71,4.14-2.75,2.67-.17,2.86-.34,1.11.34,1.22,1.9,1.73.6.94v1.3l.6.68-.09,1.3-.77.51.51.77,1,.51.85,2.35,1.81,1.79.43,1,.87,1.2.77.53.68.77.45.94.68.7,1.9,3.09-1.81.34-.34.45v.43l1.11.26L227,657l.43.09,2.26,2.41.94.51,1.56,1.73.43,1,2.67,2.24,1,.52"
        />
        <path
          onClick={e => showCityInfo(e.target.getAttribute('data-name'))}
          id="ae28d47a-650c-43d9-aedc-c1d11a068993"
          data-name="chiayi"
          d="M243.1,445l.34,2.24,2.07,2.07-1.38,3.1,6.9,1,.69,1.9,1.38,1.9,1.72.86,1.72-1,.86-1.72,3.1-2.41,1.38,1.21,3.1,1,.52-1.72,2.41-2.93-1.38-1.38L266,447.1l-2.07-.52-.86-1.72-1.55-1-1.9.69-1.38-1.21-1.21-1.72-1.72-.86-2.07.52-4.83,3.45-2.07-.52-3.28.86h0Z"
        />
      </svg>
    </Box>
  )
}

TaiwanMap.propTypes = {
  setClickedCity: PropTypes.func.isRequired,
  setCityChineseName: PropTypes.func.isRequired,
  setCityCafes: PropTypes.func.isRequired,
  setTaipeiCafes: PropTypes.func.isRequired,
  setNewTaipeiCafes: PropTypes.func.isRequired,
  getCafes: PropTypes.func.isRequired,
}

export default TaiwanMap
