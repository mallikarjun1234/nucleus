import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import PowerCalendarBase from '../_base/power-calendar-base';

class Days extends PowerCalendarBase {

  /**
  * handleKeyDown
  *
  * @method handleKeyDown overriding keydown event from power calendar
  * @param {any} event
  * @public
  *
  */
  @action
  handleKeyDown(e) {
    let { focusedId } = this;
    let daysInWeek = 7;
    if (focusedId) {
      let days = this.days;
      let day, index;
      for (let i = 0; i < days.length; i++) {
        if (days[i].id === focusedId) {
          index = i;
          break;
        }
      }
      if (e.keyCode === 33 && e.shiftKey) {
        e.preventDefault();
        this.calendar.actions.moveCenter(-1, "year", this.calendar, e);
        this.setFocusOnCalendarChange(e.keyCode, index);
        return;
      } else if (e.keyCode === 34 && e.shiftKey) {
        e.preventDefault();
        this.calendar.actions.moveCenter(1, "year", this.calendar, e);
        this.setFocusOnCalendarChange(e.keyCode, index);
        return;
      } else if (e.keyCode === 33) {
        e.preventDefault();
        this.calendar.actions.moveCenter(-1, "month", this.calendar, e);
        this.setFocusOnCalendarChange(e.keyCode, index);
        return;
      } else if (e.keyCode === 34) {
        e.preventDefault();
        this.calendar.actions.moveCenter(1, "month", this.calendar, e);
        this.setFocusOnCalendarChange(e.keyCode, index);
        return;
      } else if (e.keyCode === 36) {
        e.preventDefault();
        let newIndex = index - (index % daysInWeek);
        while(!days[newIndex].isCurrentMonth) {
          newIndex++;
        }
        day = days[newIndex];
      } else if (e.keyCode === 35) {
        e.preventDefault();
        let newIndex = (index + (daysInWeek - 1)) - (index % 7);
        while(!days[newIndex].isCurrentMonth) {
          newIndex--;
        }
        day = days[newIndex];
      } else if (e.keyCode === 38) {
        e.preventDefault();
        let newIndex = Math.max(index - 7, 0);
        day = days[newIndex];
        if (day.isDisabled || !day.isCurrentMonth) {
          for (let i = newIndex + 1; i <= index; i++) {
            day = days[i];
            if (!day.isDisabled && day.isCurrentMonth) {
              break;
            }
          }
        }
      } else if (e.keyCode === 40) {
        e.preventDefault();
        let newIndex = Math.min(index + 7, days.length - 1);
        day = days[newIndex];
        if (day.isDisabled || !day.isCurrentMonth) {
          for (let i = newIndex - 1; i >= index; i--) {
            day = days[i];
            if (!day.isDisabled && day.isCurrentMonth) {
              break;
            }
          }
        }
      } else if (e.keyCode === 37) {
        e.preventDefault();
        e.stopPropagation();
        day = days[Math.max(index - 1, 0)];
        if (!day.isCurrentMonth || (index === 0)) {
          this.calendar.actions.moveCenter(-1, "month", this.calendar, e);
          this.setFocusOnCalendarChange(e.keyCode);
          return;
        }
        if (day.isDisabled) {
          return;
        }
      } else if (e.keyCode === 39) {
        e.preventDefault();
        e.stopPropagation();
        day = days[Math.min(index + 1, days.length - 1)];
        if (!day.isCurrentMonth || (index === (days.length - 1))) {
          this.calendar.actions.moveCenter(1, "month", this.calendar, e);
          this.setFocusOnCalendarChange(e.keyCode);
          return;
        }
        if (day.isDisabled) {
          return;
        }
      } else {
        return;
      }
      this.set('focusedId', day.id);
      scheduleOnce('afterRender', this, '_focusDate', day.id);
    }
  }

}

export default Days;
