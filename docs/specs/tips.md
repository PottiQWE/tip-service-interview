# Spec: Fan tips

**Status:** Ready for design · **Target:** next sprint

## Goal

Let fans send tips to creators directly from the creator's page. Tipping is our first direct-monetization feature and should feel instant and fun.

## User stories

1. As a fan, I can send a tip with an optional message from a creator's page.
2. As a creator, I get an email and a push notification every time I receive a tip.
3. As anyone visiting a creator's page, I see the creator's total tips and the latest tips, updating live.

## Details

- Payments go through Stripe. Money goes to the creator's connected account.
- The creator page shows the 20 most recent tips with the fan's name and message.
- The total should update in near real time.

## Out of scope

- Refund UI
- Leaderboards
