from playwright.sync_api import Page, expect

def test_theme_synchronization(page: Page):
    """
    This test verifies that the theme is synchronized between the Vue app and the MkDocs site.
    """
    # 1. Arrange: Go to the Vue app.
    page.goto("http://localhost:5173")

    # 2. Screenshot: Capture the initial theme.
    page.screenshot(path="jules-scratch/verification/vue-initial-theme.png")

    # 3. Act: Click the theme toggle button.
    theme_toggle_button = page.locator("#theme-toggle")
    theme_toggle_button.click()

    # 4. Screenshot: Capture the updated theme.
    page.screenshot(path="jules-scratch/verification/vue-updated-theme.png")

    # 5. Arrange: Go to the MkDocs site.
    page.goto("http://localhost:8000")

    # 6. Screenshot: Capture the synchronized theme.
    page.screenshot(path="jules-scratch/verification/mkdocs-synchronized-theme.png")
