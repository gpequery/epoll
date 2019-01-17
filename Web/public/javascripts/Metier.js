function getElectionState(election, toHtml = true) {
    let status = -1;
    let now = Date.now();

    if (now < election.candidatureStart) {
        status = 0;
    } else if (now > election.candidatureStart && now < election.candidatureEnd) {
        status = 1;
    } else if (now > election.candidatureEnd && now < election.voteStart) {
        status = 2;
    } else if (now > election.voteStart && now < election.voteEnd) {
        status = 3;
    } else if (now > election.voteEnd) {
        status = 4;
    }

    if (toHtml) {
        switch (status) {
            case 0:
                status = 'Période des candidatures : ' + getDateHtmlFromTimeStamp(election.candidatureStart) + ' au ' + getDateHtmlFromTimeStamp(election.candidatureEnd);
                break;
            case 1:
                status = 'Fin des candidatures : ' + getDateHtmlFromTimeStamp(election.candidatureEnd);
                break;
            case 2:
                status = 'Période des votes : ' + getDateHtmlFromTimeStamp(election.voteStart) + ' au ' + getDateHtmlFromTimeStamp(election.voteEnd);
                break;
            case 3:
                status = 'Fin des votes : ' + getDateHtmlFromTimeStamp(election.voteEnd);
                break;
            case 3:
                status = 'Election fini depuis le ' + getDateHtmlFromTimeStamp(election.voteEnd);
                break;
            default:
                status = 'Error stats';
        }
    }

    return status;
}