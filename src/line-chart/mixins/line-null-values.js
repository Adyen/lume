// @vue/component
export default {
    computed: {
        /**
         * Returns an array of intervals where the data is null.
         * Each interval is an array containing the indexes of null values
         * E.g. for data of `[500, 400, null, 300, null, null, 200]` returns `[ [2], [4, 5] ]`
         */
        nullIntervals() {
            let currentInterval = null;

            return this.values.reduce((intervals, value, index) => {
                if (value == null) {
                    if (!currentInterval) {
                        currentInterval = [index];
                        if (index === this.values.length - 1) intervals.push(currentInterval); // If last value is `null`
                    }
                    else currentInterval.push(index);
                } else if (currentInterval) {
                    intervals.push(currentInterval);
                    currentInterval = null;
                }
                return intervals;
            }, []);
        },
    },
    methods: {
        /**
         * Returns a value inbetween the start and end values, based on the index provided.
         * This is used to calculate the coordinates for null values between non-null values.
         * 
         * @param {Number} start Interval start value
         * @param {Number} end Interval end value
         * @param {Number} length Interval length - how many steps between start and end values
         * @param {Number} index The current step
         * @returns Mid-way value between start and end.
         */
        getMidValue(start, end, length, index) {
            const diff = Math.abs(start - end);
            const step = diff / (length + 1);
            const sum = step * (index + 1);

            if (start > end) return start - sum;
            else return start + sum;
        },
    }
}
