# Mini Risk Register (Per Change/PR)

Use this table before merge:

| Risk | Impact | Probability | Mitigation | Production Detection |
|---|---|---|---|---|
| Example: mobile nav JS fails to mount | Medium (navigation unavailable) | Low | Keep fallback links in markup; add smoke check | Frontend error log + synthetic check |

## Notes

- Focus on top 3-5 material risks, not exhaustive lists.
- Any blocker-class risk must have a concrete mitigation before release.
