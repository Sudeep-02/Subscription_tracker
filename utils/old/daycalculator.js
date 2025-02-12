const calculator = (time) => {
  const MS_IN_A_DAY = 1000 * 60 * 60 * 24;
  const MS_IN_AN_HOUR = 1000 * 60 * 60;
  const MS_IN_A_MINUTE = 1000 * 60;

  const days = Math.floor(time / MS_IN_A_DAY);
  const hours = Math.floor((time % MS_IN_A_DAY) / MS_IN_AN_HOUR);
  const minutes = Math.floor((time % MS_IN_AN_HOUR) / MS_IN_A_MINUTE);
  const seconds = Math.floor((time % MS_IN_A_MINUTE) / 1000);

  return { days, hours, minutes };
};

export default calculator;
