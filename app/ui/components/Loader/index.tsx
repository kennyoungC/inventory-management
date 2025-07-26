const Loader = () => {
    return (
        <svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.364A8.001 8.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.574z"
            ></path>
        </svg>
    );
};

export default Loader;
