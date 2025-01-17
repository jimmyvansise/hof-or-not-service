type Failure<T> = {
    readonly ok: false;
    readonly status: number;
    readonly error: T;
};
type Success<T> = {
    readonly ok: true;
    readonly status: number;
    readonly value: T;
};
type Either<E, A> = Failure<E> | Success<A>;