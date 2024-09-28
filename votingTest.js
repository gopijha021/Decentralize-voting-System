const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
    let votingInstance;

    before(async () => {
        votingInstance = await Voting.deployed();
    });

    it("should initialize with no candidates", async () => {
        const candidatesCount = await votingInstance.candidatesCount();
        assert.equal(candidatesCount, 0, "Candidates count should be zero initially");
    });

    it("should add a candidate", async () => {
        await votingInstance.addCandidate("Alice", { from: accounts[0] });
        const candidate = await votingInstance.candidates(1);
        assert.equal(candidate.name, "Alice", "The candidate name should be Alice");
        assert.equal(candidate.voteCount.toNumber(), 0, "The candidate should have 0 votes initially");
    });

    it("should allow voting", async () => {
        await votingInstance.vote(1, { from: accounts[1] });
        const candidate = await votingInstance.candidates(1);
        const voter = await votingInstance.voters(accounts[1]);
        assert.equal(candidate.voteCount.toNumber(), 1, "The candidate should have 1 vote");
        assert.equal(voter.hasVoted, true, "The voter should be marked as having voted");
    });

    it("should not allow double voting", async () => {
        try {
            await votingInstance.vote(1, { from: accounts[1] });
            assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert(error.message.includes("You have already voted"), "Expected error message not found");
        }
    });
});
