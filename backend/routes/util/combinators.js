// Base Combinator Class
class P {
    constructor(s) {
        this.s = { result: [], remainder: [], state: s };
    }

    run(s) {
        this.remainder = s;
    }

    take() {
        return this.s.state;
    }

    then(other) {
        return new And(this, other);
    }

    or(f) {
        return this;
    }
}

class Contains extends P {
    constructor(v) {
        super();
        this.v = v;
    }

    run(s) {
        let idx = s.remainder.indexOf(this.v);
        if (idx === -1) {
            return {
                ...s,
                result: [...s.result, undefined]
            };
        }

        s.remainder.splice(idx, 1);

        let rep = {
            ...s,
            result: [...s.result, this.v],
        };

        return rep;
    }
}

class And extends P {
    constructor(a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    run(s) {
        return this.b.run(this.a.run(s));
    }
}

class Success extends P {
    constructor(a, b) {
        super();
        this.a = a;
        this.b = b;
    }

    run(s) {
        if (s.result[s.result.length - 1]) {
            return this.a.run(s);
        } else {
            return this.b.run(s);
        }
    }
}

class Func extends P {
    constructor(f) {
        super();
        this.f = f;
    }

    run(s) {
        s.state = this.f(s.state);
        return s;
    }
}

const contains = s => new Contains(s)
const state = (s, input) => {
    return { result: [], remainder: input, state: s };
}

const success = (a, b) => new Success(a, b);
const func = f => new Func(f);
const ident = func(x => x);

module.exports = {
    state, contains, success, func, ident
}
