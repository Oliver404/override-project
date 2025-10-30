from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:5173/en/docs")
        page.wait_for_url("http://localhost:5173/docs/")
        page.screenshot(path="jules-scratch/verification/redirection_verification.png")
        browser.close()

run()
