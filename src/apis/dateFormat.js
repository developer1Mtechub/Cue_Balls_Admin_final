export default function formatDate(dateString) {
    let date = new Date(dateString);

    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let year = date.getFullYear();

    return day + '-' + month + '-' + year;
}