# InsightLoop — First-Use Activation Guide

## Learner Activation

1. Open the deployed InsightLoop URL and select **Sign in**.
2. Authenticate through the project’s OAuth flow.
3. Open **Learning studio** and submit a real topic, the original question, your reasoning, and your confidence level.
4. Wait for the server-side diagnosis. The latest insight and next adaptive probe will appear after the validated response is stored.
5. Return later with a new response to continue or revise the topic path.

Learners should enter only educational content. Do not include personal identifiers or sensitive information in free-text work.

## Teacher Activation

The project owner is initially provisioned as `admin`. To authorise another user for Teacher Lens, promote that authenticated user to the `analyst` role in the database management interface. Teacher Lens then exposes aggregate counts and topics from the workspace; it does not seed or invent class activity.

## Operational Checklist

| Check | Expected result |
|---|---|
| OAuth login | Learner returns to the workspace with a private session. |
| Submit response | The submission button displays a pending state until the structured diagnosis returns. |
| Path creation | A current learning path appears for the submitted topic. |
| Retry after a failure | No attempt is recorded when the diagnosis has not been validated. |
| Teacher Lens | Available only to `admin` or `analyst` users and empty until genuine submissions exist. |
