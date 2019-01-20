function getElectionState(election, toHtml = true) {
    let status = -1;
    let now = Date.now();

    if (now < election.candidaturePeriodStart) {
        status = 0;
    } else if (now > election.candidaturePeriodStart && now < election.candidaturePeriodEnd) {
        status = 1;
    } else if (now > election.candidaturePeriodEnd && now < election.votePeriodStart) {
        status = 2;
    } else if (now > election.votePeriodStart && now < election.votePeriodEnd) {
        status = 3;
    } else if (now > election.votePeriodEnd) {
        status = 4;
    }

    if (toHtml) {
        switch (status) {
            case 0:
                status = 'Période des candidatures : ' + getDateHtmlFromTimeStamp(election.candidaturePeriodStart) + ' au ' + getDateHtmlFromTimeStamp(election.candidaturePeriodEnd);
                break;
            case 1:
                status = 'Fin des candidatures : ' + getDateHtmlFromTimeStamp(election.candidaturePeriodEnd);
                break;
            case 2:
                status = 'Période des votes : ' + getDateHtmlFromTimeStamp(election.votePeriodStart) + ' au ' + getDateHtmlFromTimeStamp(election.votePeriodEnd);
                break;
            case 3:
                status = 'Fin des votes : ' + getDateHtmlFromTimeStamp(election.votePeriodEnd);
                break;
            case 3:
                status = 'Election fini depuis le ' + getDateHtmlFromTimeStamp(election.votePeriodEnd);
                break;
            default:
                status = 'Error stats';
        }
    }

    return status;
}