import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Verify docs page
        await page.goto("http://localhost:5173/docs")
        await page.wait_for_selector(".prose")
        await page.screenshot(path="docs_screenshot.png")

        # Verify blog page
        await page.goto("http://localhost:5173/blog")
        await page.wait_for_selector(".prose")
        await page.screenshot(path="blog_screenshot.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
