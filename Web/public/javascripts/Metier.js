function getElectionState(election) {
    let result = [];
    let now = Date.now();

    if (now < election.candidaturePeriodStart) {
        result.status = 0;
    } else if (now > election.candidaturePeriodStart && now < election.candidaturePeriodEnd) {
        result.status = 1;
        result.className = 'currentCandidate';
    } else if (now > election.candidaturePeriodEnd && now < election.votePeriodStart) {
        result.status = 2;
    } else if (now > election.votePeriodStart && now < election.votePeriodEnd) {
        result.status = 3;
        result.className = 'currentVote';
    } else if (now > election.votePeriodEnd) {
        result.status = 4;
    } else {
        result.status = -1;
    }

    switch (result.status) {
        case 0:
            result.trad = 'Période des candidatures : ' + getDateHtmlFromTimeStamp(election.candidaturePeriodStart) + ' au ' + getDateHtmlFromTimeStamp(election.candidaturePeriodEnd);
            break;
        case 1:
            result.trad = 'Fin des candidatures : ' + getDateHtmlFromTimeStamp(election.candidaturePeriodEnd);
            break;
        case 2:
            result.trad = 'Période des votes : ' + getDateHtmlFromTimeStamp(election.votePeriodStart) + ' au ' + getDateHtmlFromTimeStamp(election.votePeriodEnd);
            break;
        case 3:
            result.trad = 'Fin des votes : ' + getDateHtmlFromTimeStamp(election.votePeriodEnd);
            break;
        case 3:
            result.trad = 'Election fini depuis le ' + getDateHtmlFromTimeStamp(election.votePeriodEnd);
            break;
        default:
            result.trad = 'Error stats';
    }

    return result;
}