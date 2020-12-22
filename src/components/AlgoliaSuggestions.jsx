
const AlgoliaSuggestions = ({ hit }) => {
    return (
        <a>{hit.query}</a>
    );
}

export default AlgoliaSuggestions;