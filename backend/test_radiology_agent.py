from app.agents.radiology_lab_agent import RadiologyLabAgent

agent = RadiologyLabAgent()

result = agent.run(
    pdf="../sample_lab_report.pdf",
    image="../sample_xray.png"
)

print(result)