from security.security_gateway import SecurityGateway


gateway = SecurityGateway()


# Test 1: Research Agent can access public research
def test_research_agent_allowed():

    result = gateway.execute(
        "Research Agent",
        "search_public_knowledge",
        {"query": "Climate change"}
    )

    assert result["decision"] == "ALLOWED"
    assert result["executed"] is True


# Test 2: Finance Agent can access financial reports
def test_finance_agent_allowed():

    result = gateway.execute(
        "Finance Agent",
        "view_financial_reports",
        {"query": "Quarterly report"}
    )

    assert result["decision"] == "ALLOWED"
    assert result["executed"] is True


# Test 3: Admin Agent can access system reports
def test_admin_agent_allowed():

    result = gateway.execute(
        "Admin Agent",
        "view_system_reports",
        {}
    )

    assert result["decision"] == "ALLOWED"
    assert result["executed"] is True


# Test 4: Research Agent cannot access financial reports
def test_research_cannot_access_finance():

    result = gateway.execute(
        "Research Agent",
        "view_financial_reports",
        {}
    )

    assert result["decision"] == "BLOCKED"
    assert result["executed"] is False


# Test 5: Finance Agent cannot access system reports
def test_finance_cannot_access_admin():

    result = gateway.execute(
        "Finance Agent",
        "view_system_reports",
        {}
    )

    assert result["decision"] == "BLOCKED"
    assert result["executed"] is False


# Test 6: Unknown agents cannot access tools
def test_unknown_agent_blocked():

    result = gateway.execute(
        "Unknown Agent",
        "search_public_knowledge",
        {}
    )

    assert result["decision"] == "BLOCKED"
    assert result["executed"] is False