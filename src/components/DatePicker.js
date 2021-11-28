/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
import Context from '../Context';

function DatePicker({ valordatepicker, mododatepicker }) {

  // recuperando estados globais (Context.API).
  const {
    setpickdate1,
    pickdate1,
    setpickdate2,
    pickdate2
  } = useContext(Context)

  const [viewcomponent, setviewcomponent] = useState(0)
  const [mode, setmode] = useState(0)
  useEffect(() => {
    currentMonth();
    moment().format('DD/MM')
    setviewcomponent(valordatepicker)
    setmode(mododatepicker)
  }, [valordatepicker, mododatepicker])

  // preparando a array com as datas.
  var arraydate = [];
  const [arraylist, setarraylist] = useState([]);
  // preparando o primeiro dia do mês.
  var month = moment().format('MM');
  var year = moment().format('YYYY');
  const [startdate] = useState(moment('01/' + month + '/' + year, 'DD/MM/YYYY'));
  // descobrindo o primeiro dia do calendário (último domingo do mês anteior).
  const firstSunday = (x, y) => {
    while (x.weekday() > 0) {
      x.subtract(1, 'day');
      y.subtract(1, 'day');
    }
    // se o primeiro domingo da array ainda cair no mês atual:
    if (x.month() == startdate.month()) {
      x.subtract(7, 'days');
      y.subtract(7, 'days');
    }
  }
  // criando array com 42 dias a partir da startdate.
  const setArrayDate = (x, y) => {
    arraydate = [x.format('DD/MM/YYYY')];
    while (y.diff(x, 'days') > 1) {
      x.add(1, 'day');
      arraydate.push(x.format('DD/MM/YYYY').toString());
    }
  }
  // criando a array de datas baseada no mês atual.
  const currentMonth = () => {
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês anterior.
  const previousMonth = () => {
    startdate.subtract(30, 'days');
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês seguinte.
  const nextMonth = () => {
    startdate.add(30, 'days');
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }

  // selecionando uma data no datepicker.
  const selectDate = (value) => {
    if (mode == 1) {
      setpickdate1(value);
    } else {
      setpickdate2(value);
    }
    setviewcomponent(0);
  }

  // renderização do datepicker.
  if (viewcomponent === 1) {
    return (
      <div className="menucover"
        onClick={() => setviewcomponent(0)}
        style={{
          zIndex: 999, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
        }}>
        <div
          className="menucontainer"
          style={{
            display: 'flex',
            position: 'unset',
            zIndex: 99,
            margin: window.innerWidth < 400 ? 5 : 0,
            padding: 15,
            width: window.innerWidth > 400 ? 450 : '95vw',
            height: window.innerWidth > 400 ? 500 : '95vh',
            borderRadius: 5,
          }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: '395',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}>
            <button
              className="blue-button"
              onClick={(e) => { previousMonth(); e.stopPropagation(); }}
              id="previous"
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                color: '#ffffff',
              }}
              title={'MÊS ANTERIOR'}
            >
              {'◄'}
            </button>
            <p
              className="title2"
              style={{
                width: 200,
                fontSize: 16,
                margin: 2.5
              }}>
              {startdate.format('MMMM').toUpperCase() + ' ' + startdate.year()}
            </p>
            <button
              className="blue-button"
              onClick={(e) => { nextMonth(); e.stopPropagation(); }}
              id="next"
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                color: '#ffffff',
              }}
              title={'PRÓXIMO MÊS'}
            >
              {'►'}
            </button>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: window.innerWidth > 800 ? 395 : 0.95 * window.innerWidth,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}>
            <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>DOM</p>
            <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>SEG</p>
            <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>TER</p>
            <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>QUA</p>
            <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>QUI</p>
            <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>SEX</p>
            <p className="title2" style={{ width: 50, fontSize: 12, margin: 2.5 }}>SAB</p>
          </div>
          <div
            className="secondary"
            id="LISTA DE DATAS"
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              margin: 0,
              padding: 5,
              width: window.innerWidth > 800 ? 395 : 0.95 * window.innerWidth,
              height: window.innerWidth > 800 ? 340 : '',
              boxShadow: 'none'
            }}
          >
            {arraylist.map((item) => (
              <button
                className={mode == 1 && item == pickdate1 ? "red-button" : mode == 2 && item == pickdate2 ? "red-button" : "blue-button"}
                onClick={(e) => { selectDate(item); e.stopPropagation() }}
                style={{
                  width: window.innerWidth > 800 ? 50 : 44,
                  minWidth: window.innerWidth > 800 ? 50 : 44,
                  height: 50,
                  margin: 2.5,
                  color: '#ffffff',
                  opacity: item.substring(3, 5) === moment(startdate).format('MM') ? 1 : 0.5,
                }}
                title={item}
              >
                {item.substring(0, 2)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
export default DatePicker;
