const issueSorter = (issueA, issueB) => {
  if (issueA.status === issueB.status) {
    if (issueA.name === issueB.name) {
      return (issueA.createdAt > issueB.createdAt) ? 1 : -1;
    }
    return (issueA.name > issueB.name) ? 1 : -1;
  }
  if (issueA.status === 'inactive' || issueB.status === 'pending') {
    return -1;
  }
  if (issueA.status === 'pending' || issueB.status === 'inactive') {
    return 1;
  }
  return 0;
}

export default issueSorter;
